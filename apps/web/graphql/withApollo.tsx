import React from 'react'
import { useRouter } from 'next/router'
import { NextPageContext } from 'next'
import { ApolloProvider } from '@apollo/client/react'
import { getLocaleFromPath } from '@island.is/web/i18n/withLocale'
import initApollo from './client'
import { ScreenContext } from '../types'

export const withApollo = (Component) => {
  const NewComponent = ({ apolloState, pageProps }) => {
    const { asPath } = useRouter()
    const clientLocale = getLocaleFromPath(asPath)
    return (
      <ApolloProvider client={initApollo({ ...apolloState }, clientLocale)}>
        <Component {...pageProps} />
      </ApolloProvider>
    )
  }

  NewComponent.getProps = async (ctx: Partial<ScreenContext>) => {
    const clientLocale = getLocaleFromPath(ctx.asPath)
    const apolloClient = initApollo({}, clientLocale)
    const newContext = { ...ctx, apolloClient }
    const props = Component.getProps ? await Component.getProps(newContext) : {}
    const cache = apolloClient.cache.extract()
    return {
      pageProps: props,
      apolloState: cache,
    }
  }

  return NewComponent
}

export default withApollo
