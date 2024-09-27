import { useEffectOnce } from '@island.is/react-spa/shared'
import { ReactNode, useCallback, useEffect, useReducer, useState } from 'react'

import { LoadingScreen } from '@island.is/react/components'
import { BffContext } from './BffContext'
import { BffPoller } from './BffPoller'
import { BffSessionExpiredModal } from './BffSessionExpiredModal'
import { ErrorScreen } from './ErrorScreen'
import { BffBroadcastEvents, useBffBroadcaster } from './bff.hooks'
import { ActionType, initialState, reducer } from './bff.state'
import { createBffUrlGenerator, isNewSession } from './bff.utils'

const ONE_HOUR_MS = 1000 * 60 * 60
const BFF_SERVER_UNAVAILABLE = 'BFF_SERVER_UNAVAILABLE'

type BffProviderProps = {
  children: ReactNode
  /**
   * The base path of the application.
   */
  applicationBasePath: string
}

export const BffProvider = ({
  children,
  applicationBasePath,
}: BffProviderProps) => {
  const [showSessionExpiredScreen, setSessionExpiredScreen] = useState(false)
  const bffUrlGenerator = createBffUrlGenerator(applicationBasePath)
  const [state, dispatch] = useReducer(reducer, initialState)

  const { authState } = state
  const showErrorScreen = authState === 'error'
  const showLoadingScreen =
    authState === 'loading' ||
    authState === 'switching' ||
    authState === 'logging-out'
  const isLoggedIn = authState === 'logged-in'

  const { postMessage } = useBffBroadcaster((event) => {
    if (
      isLoggedIn &&
      event.data.type === BffBroadcastEvents.NEW_SESSION &&
      isNewSession(state.userInfo, event.data.userInfo)
    ) {
      setSessionExpiredScreen(true)
    } else if (event.data.type === BffBroadcastEvents.LOGOUT) {
      dispatch({
        type: ActionType.LOGGED_OUT,
      })

      signIn()
    }
  })

  useEffect(() => {
    if (isLoggedIn) {
      // Broadcast to all tabs/windows/iframes that a new session has started
      postMessage({
        type: BffBroadcastEvents.NEW_SESSION,
        userInfo: state.userInfo,
      })
    }
  }, [postMessage, state.userInfo, isLoggedIn])

  const checkLogin = async (noRefresh = false) => {
    dispatch({
      type: ActionType.SIGNIN_START,
    })

    try {
      const url = bffUrlGenerator('/user', {
        no_refresh: noRefresh.toString(),
      })

      const res = await fetch(url, {
        credentials: 'include',
      })

      if (!res.ok) {
        // Bff server is down
        if (res.status >= 500) {
          throw new Error(BFF_SERVER_UNAVAILABLE)
        }

        // For other none ok responses, like 401/403, proceed with sign-in redirect.
        signIn()

        return
      }

      const user = await res.json()

      dispatch({
        type: ActionType.SIGNIN_SUCCESS,
        payload: user,
      })
    } catch (error) {
      dispatch({
        type: ActionType.ERROR,
        payload: error,
      })
    }
  }

  const signIn = useCallback(() => {
    dispatch({
      type: ActionType.SIGNIN_START,
    })

    window.location.href = bffUrlGenerator('/login', {
      target_link_uri: window.location.href,
    })
  }, [bffUrlGenerator])

  const signOut = useCallback(() => {
    if (!state.userInfo) {
      return
    }

    dispatch({
      type: ActionType.LOGGING_OUT,
    })

    window.location.href = bffUrlGenerator('/logout', {
      sid: state.userInfo.profile.sid,
    })

    setTimeout(() => {
      // We will wait 5 seconds before we post the logout message to other tabs/windows/iframes.
      // The reason is that IDS will not log the user out immediately.
      postMessage({
        type: BffBroadcastEvents.LOGOUT,
      })
    }, 5000)
  }, [bffUrlGenerator, postMessage, state.userInfo])

  const switchUser = (nationalId?: string) => {
    dispatch({
      type: ActionType.SWITCH_USER,
    })

    window.location.href = bffUrlGenerator(
      '/login',
      nationalId
        ? {
            login_hint: nationalId,
          }
        : {
            prompt: 'select_account',
          },
    )
  }

  const checkQueryStringError = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const error = urlParams.get('bff_error_code')
    const errorDescription = urlParams.get('bff_error_description')

    if (error) {
      dispatch({
        type: ActionType.ERROR,
        payload: new Error(`${error}: ${errorDescription}`),
      })
    }

    // Returns true if there is an error
    return !!error
  }

  useEffectOnce(() => {
    const hasError = checkQueryStringError()

    if (!hasError) {
      checkLogin()
    }
  })

  useEffectOnce(() => {
    const timeout = setTimeout(() => {
      // After one hour we check if the user is still logged in
      // and we tell the /user endpoint not to refresh the tokens,
      // since we are checking for timeout expiration.
      checkLogin(true)
    }, ONE_HOUR_MS)

    return () => {
      clearTimeout(timeout)
    }
  })

  const newSessionCb = useCallback(() => {
    setSessionExpiredScreen(true)
  }, [])

  const onRetry = () => {
    window.location.href = applicationBasePath
  }

  const renderContent = () => {
    if (showErrorScreen) {
      return (
        <ErrorScreen
          onRetry={onRetry}
          {...(state?.error?.message === BFF_SERVER_UNAVAILABLE && {
            title: 'Þjónusta liggur niðri',
          })}
        />
      )
    }

    if (showLoadingScreen) {
      return <LoadingScreen ariaLabel="Er að vinna í innskráningu" />
    }

    if (showSessionExpiredScreen) {
      return <BffSessionExpiredModal onLogin={signIn} />
    }

    if (isLoggedIn) {
      return <BffPoller newSessionCb={newSessionCb}>{children}</BffPoller>
    }

    return null
  }

  return (
    <BffContext.Provider
      value={{
        ...state,
        signIn,
        signOut,
        switchUser,
        bffUrlGenerator,
      }}
    >
      {renderContent()}
    </BffContext.Provider>
  )
}
