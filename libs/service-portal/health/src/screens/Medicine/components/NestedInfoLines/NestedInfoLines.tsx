import { Box, Text } from '@island.is/island-ui/core'
import { NestedLines } from '@island.is/service-portal/core'
import React from 'react'

interface Props {
  label?: string
  data: {
    title: string
    value?: string | number | React.ReactElement
    type?: 'text' | 'link'
    href?: string
  }[]
}

const NestedInfoLines: React.FC<Props> = ({ label, data }) => {
  return (
    <>
      {label && (
        <Box paddingLeft={2}>
          <Text variant="small" fontWeight="medium">
            {label}
          </Text>
        </Box>
      )}
      <NestedLines data={data} />
    </>
  )
}

export default NestedInfoLines
