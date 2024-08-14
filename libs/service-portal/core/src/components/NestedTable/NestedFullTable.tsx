import { Box, Table as T, Text } from '@island.is/island-ui/core'
import { tableStyles } from '../../utils/utils'

import * as styles from './NestedTable.css'

interface Props {
  headerArray: string[]
  data: Array<string[]>
}

export const NestedFullTable = ({ headerArray, data }: Props) => {
  return (
    <Box className={styles.wrapper} background="white">
      <T.Table>
        <T.Head>
          <T.Row>
            {headerArray.map((item, i) => (
              <T.HeadData
                box={{
                  textAlign: i > 1 ? 'right' : 'left',
                  paddingRight: 2,
                  paddingLeft: 2,
                  className: styles.noBorder,
                }}
                key={i}
                text={{ truncate: true }}
                style={tableStyles}
              >
                <Text variant="small" fontWeight="semiBold">
                  {item}
                </Text>
              </T.HeadData>
            ))}
          </T.Row>
        </T.Head>
        <T.Body>
          {data?.map((row, i) => (
            <T.Row key={i}>
              {row.map((value, ii) => (
                <T.Data
                  box={{
                    paddingRight: 2,
                    paddingLeft: 2,
                    textAlign: ii > 1 ? 'right' : 'left',
                    background: i % 2 === 0 ? 'white' : undefined,
                    className: styles.noBorder,
                  }}
                  key={ii}
                  style={tableStyles}
                >
                  <Text variant="small">{value}</Text>
                </T.Data>
              ))}
            </T.Row>
          ))}
        </T.Body>
      </T.Table>
    </Box>
  )
}
