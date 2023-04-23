import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import homeScreen from '@island.is/web/screens/Home/Home'
import { GetServerSideProps } from 'next'

// Hack needed to avoid JSON-Serialization validation error from Next.js https://github.com/zeit/next.js/discussions/11209
// >>> Reason: `undefined` cannot be serialized as JSON. Please use `null` or omit this value all together.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const deleteUndefined = (obj: Record<string, any> | undefined): void => {
  if (obj) {
    Object.keys(obj).forEach((key: string) => {
      if (obj[key] && typeof obj[key] === 'object') {
        deleteUndefined(obj[key])
      } else if (typeof obj[key] === 'undefined') {
        delete obj[key] // eslint-disable-line no-param-reassign
      }
    })
  }
}

const Screen = withApollo(withLocale('is')(homeScreen))

export default Screen

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const props = Screen.getProps ? await Screen.getProps(ctx) : ctx
  deleteUndefined(props)

  return {
    props,
  }
}
