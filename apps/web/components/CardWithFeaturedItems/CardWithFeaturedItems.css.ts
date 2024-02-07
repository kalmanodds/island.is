import { style } from '@vanilla-extract/css'
import { themeUtils } from '@island.is/island-ui/theme'

export const container = style({
  height: 250,
  minWidth: 0,
  minHeight: 0,
})

export const icon = style({
  objectFit: 'cover',
  width: '100%',
  height: 'auto',
  maxWidth: 170,
  maxHeight: 170,
  ...themeUtils.responsiveStyle({
    xs: {
      maxWidth: 105,
      maxHeight: 125,
    },
  }),
})
