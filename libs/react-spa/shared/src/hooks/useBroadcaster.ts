import { useCallback, useEffect, useRef, useState } from 'react'

type UseBroadcasterArgs<T> = {
  channel: BroadcastChannel
  onMessage?: (event: MessageEvent<T>) => void
}

type UseBroadcasterReturn<T> = {
  channel: BroadcastChannel
  postMessage: (message: T) => void
  error: Error | null
}

/**
 * Custom hook to manage communication via a BroadcastChannel.
 *
 * This hook:
 * - Sets up a listener for incoming messages on the provided BroadcastChannel.
 * - Provides a `postMessage` function to send messages through the BroadcastChannel.
 * - Handles errors encountered while sending messages.
 *
 * @param channel - The BroadcastChannel instance to use for messaging.
 * @param onMessage - Optional callback function to handle incoming messages.
 *
 * @returns An object containing the BroadcastChannel instance, the `postMessage` function, and any errors encountered.
 */
export const useBroadcaster = <T>({
  channel,
  onMessage,
}: UseBroadcasterArgs<T>): UseBroadcasterReturn<T> => {
  const [error, setError] = useState<Error | null>(null)
  const onMessageRef = useRef(onMessage)

  useEffect(() => {
    onMessageRef.current = onMessage
  }, [onMessage])

  const handleBroadcastMessage = useCallback(
    (event: MessageEvent<T>) => {
      try {
        onMessageRef.current?.(event)
      } catch (err) {
        setError(err as Error)
      }
    },
    [onMessageRef],
  )

  useEffect(() => {
    channel.addEventListener('message', handleBroadcastMessage)

    return () => {
      channel.removeEventListener('message', handleBroadcastMessage)
    }
  }, [channel, handleBroadcastMessage])

  const postMessage = useCallback(
    (message: T) => {
      try {
        channel.postMessage(message)
      } catch (err) {
        console.error('Error posting message to BroadcastChannel:', err)
        setError(err as Error)
      }
    },
    [channel],
  )

  return {
    channel,
    postMessage,
    error,
  }
}

/**
 * Factory function to create a custom hook for managing a BroadcastChannel.
 *
 * This factory function:
 * - Creates a new BroadcastChannel instance with the specified channel name.
 * - Passes the instance to `useBroadcaster` along with the `onMessage` handler if provided.
 *
 * @param channelName - The name of the BroadcastChannel to listen to.
 *
 * @returns A hook that can be used to manage the BroadcastChannel and handle messages.
 *
 * @example
 *  export enum AuthBroadcastEvents {
 *    NEW_SESSION = 'NEW_SESSION',
 *    LOGOUT = 'LOGOUT',
 *  }
 *
 *  type NewSessionEvent = {
 *    type: AuthBroadcastEvents.NEW_SESSION
 *    userInfo: User
 *  }
 *
 *  type LogoutEvent = {
 *    type: AuthBroadcastEvents.LOGOUT
 *  }
 *
 *  export type AuthBroadcastEvent = NewSessionEvent | LogoutEvent
 *
 *  export const useAuthBroadcaster = createBroadcasterHook<AuthBroadcastEvent>('auth_channel')
 *
 * const MyComponent = () => {
 *  const { postMessage, error } = useAuthBroadcaster((event) => {
 *   if (event.data.type === AuthBroadcastEvents.NEW_SESSION) {
 *    console.log('New session started:', event.data.userInfo)
 *  }
 * })
 *
 * useEffect(() => {
 *  postMessage({ type: AuthBroadcastEvents.LOGOUT })
 * }, [postMessage])
 */
export const createBroadcasterHook = <Events>(channelName: string) => {
  const channel = new BroadcastChannel(channelName)

  return (onMessage?: (event: MessageEvent<Events>) => void) => {
    return useBroadcaster<Events>({ channel, onMessage })
  }
}
