import { AccordionCard, Input, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React from 'react'
import { m } from '../../lib/messages'
import ContentCard from './ContentCard'

interface BasicInfoProps {
  clientId: string
  clientSecret?: string
}
const BasicInfoContent = ({ clientId, clientSecret }: BasicInfoProps) => {
  const { formatMessage } = useLocale()
  const idsUrl = 'https://identity-server.dev01.devland.is'

  return (
    <ContentCard title={formatMessage(m.basicInfo)}>
      <Stack space={3}>
        <Input
          readOnly
          type="text"
          size="sm"
          name="application"
          value={clientId}
          label={formatMessage(m.clientId)}
        />
        <Stack space={1}>
          <Input
            readOnly
            type="password"
            size="sm"
            name="clientSecret"
            value={clientSecret}
            label={formatMessage(m.clientSecret)}
          />
          <Text variant={'small'}>
            {formatMessage(m.clientSecretDescription)}
          </Text>
        </Stack>
        <Input
          readOnly
          type="text"
          size="sm"
          name="application"
          value={idsUrl}
          label={formatMessage(m.idsUrl)}
        />
        {/*<AccordionCard*/}
        {/*  id="otherEndpoints"*/}
        {/*  label={formatMessage(m.otherEndpoints)}*/}
        {/*>*/}
        {/*  <Stack space={3}>*/}
        {/*    <Input*/}
        {/*      readOnly*/}
        {/*      type="text"*/}
        {/*      size="sm"*/}
        {/*      name="application"*/}
        {/*      value={basicInfo.oAuthAuthorizationUrl}*/}
        {/*      label={formatMessage(m.oAuthAuthorizationUrl)}*/}
        {/*    />*/}
        {/*    <Input*/}
        {/*      readOnly*/}
        {/*      type="text"*/}
        {/*      size="sm"*/}
        {/*      name="application"*/}
        {/*      value={basicInfo.deviceAuthorizationUrl}*/}
        {/*      label={formatMessage(m.deviceAuthorizationUrl)}*/}
        {/*    />*/}
        {/*    <Input*/}
        {/*      readOnly*/}
        {/*      type="text"*/}
        {/*      size="sm"*/}
        {/*      name="application"*/}
        {/*      value={basicInfo.oAuthTokenUrl}*/}
        {/*      label={formatMessage(m.oAuthTokenUrl)}*/}
        {/*    />*/}
        {/*    <Input*/}
        {/*      readOnly*/}
        {/*      type="text"*/}
        {/*      size="sm"*/}
        {/*      name="application"*/}
        {/*      value={basicInfo.oAuthUserInfoUrl}*/}
        {/*      label={formatMessage(m.oAuthUserInfoUrl)}*/}
        {/*    />*/}
        {/*    <Input*/}
        {/*      readOnly*/}
        {/*      type="text"*/}
        {/*      size="sm"*/}
        {/*      name="application"*/}
        {/*      value={basicInfo.openIdConfiguration}*/}
        {/*      label={formatMessage(m.openIdConfiguration)}*/}
        {/*    />*/}
        {/*    <Input*/}
        {/*      readOnly*/}
        {/*      type="text"*/}
        {/*      size="sm"*/}
        {/*      name="application"*/}
        {/*      value={basicInfo.jsonWebKeySet}*/}
        {/*      label={formatMessage(m.jsonWebKeySet)}*/}
        {/*    />*/}
        {/*  </Stack>*/}
        {/*</AccordionCard>*/}
      </Stack>
    </ContentCard>
  )
}

export default BasicInfoContent
