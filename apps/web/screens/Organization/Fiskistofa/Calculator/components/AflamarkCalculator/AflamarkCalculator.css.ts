import { globalStyle, style } from '@vanilla-extract/css'

export const selectBox = style({
  width: '250px',
})

export const tableContainer = style({
  border: '1px solid #CCDFFF',

  background: '#FFFFFF',

  borderRadius: '8px',
  borderCollapse: 'separate',
  overflowX: 'scroll',

  position: 'relative',
  tableLayout: 'fixed',
  borderSpacing: 0,
})

export const tableHead = style({
  backgroundColor: '#E6F2FB',
})

export const visualSeparationLine = style({
  borderTop: '1px solid #CCDFFF',
})

globalStyle(`${tableContainer} th`, {
  padding: '16px 8px',
  fontSize: '18px',
  fontWeight: '300',
})

globalStyle(`${tableContainer} input`, {
  textAlign: 'right',
})

globalStyle(`${tableContainer} th:nth-child(1)`, {
  textAlign: 'left',
})

globalStyle(`${tableContainer}:not(th:nth-child(1))`, {
  textAlign: 'right',
})

globalStyle(`${tableContainer} td`, {
  padding: '8px',
  fontSize: '14px',
})

globalStyle(`${tableContainer} tr td:nth-child(1)`, {
  backgroundColor: 'rgba(229, 229, 229, 0.65)',
  borderRight: '1px solid #CCDFFF',
  position: 'sticky',
  textAlign: 'left',
  width: '120px',
  minWidth: '120px',
  maxWidth: '120px',
  left: '0px',
})

globalStyle(`${tableContainer} tr th:nth-child(1)`, {
  borderRight: '1px solid #CCDFFF',
  position: 'sticky',
  width: '120px',
  minWidth: '120px',
  maxWidth: '120px',
  left: '0px',
})

globalStyle(`${tableContainer} tr td:nth-child(2)`, {
  backgroundColor: 'rgba(230, 242, 251, 0.35)',
  borderRight: '1px solid #CCDFFF',
  position: 'sticky',
  textAlign: 'right',
  width: '180px',
  minWidth: '180px',
  maxWidth: '180px',
  left: '166px',
})

globalStyle(`${tableContainer} tr th:nth-child(2)`, {
  borderRight: '1px solid #CCDFFF',
  position: 'sticky',
  width: '180px',
  minWidth: '180px',
  maxWidth: '180px',
  left: '166px',
})
