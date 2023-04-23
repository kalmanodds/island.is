import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import RegulationsHome from '@island.is/web/screens/Regulations/RegulationsHome'
import { getServerSidePropsWrapper } from '@island.is/web/utils/getServerSidePropsWrapper'

const Screen = withApollo(withLocale('is')(RegulationsHome))

export default Screen

export const getServerSideProps = getServerSidePropsWrapper(Screen)
