import { Box, LinkV2, Text } from '@island.is/island-ui/core'

import { link } from '../../MarkdownWrapper/MarkdownWrapper.css'

const RenderPersonalData = (
  name?: string | null,
  email?: string | null,
  phoneNumber?: string | null,
  breakSpaces = true,
) => (
  <Box display={breakSpaces ? 'block' : 'flex'} dataTestId="personalInfo">
    {name && (
      <Text key={name} whiteSpace="pre">{`${name}${
        (email || phoneNumber) && !breakSpaces ? `, ` : ''
      }`}</Text>
    )}
    {email && (
      <>
        <LinkV2 href={`mailto:${email}`} className={link} key={email}>
          <Text as="span" whiteSpace="pre">
            {email}
          </Text>
        </LinkV2>
        <Text as="span" whiteSpace="pre">
          {phoneNumber ? `, ` : ''}
        </Text>
      </>
    )}
    {phoneNumber && (
      <Text key={phoneNumber} whiteSpace="pre">
        {`s. ${phoneNumber}`}
      </Text>
    )}
  </Box>
)

export default RenderPersonalData
