import * as React from 'react'
import type { SvgProps as SVGRProps } from '../types'

const SvgLinkOutline = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="link-outline_svg__ionicon"
      viewBox="0 0 30 16"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M8 3.125C6.70707 3.125 5.46709 3.63861 4.55285 4.55285C3.63861 5.46709 3.125 6.70707 3.125 8C3.125 9.29293 3.63861 10.5329 4.55285 11.4471C5.46709 12.3614 6.70707 12.875 8 12.875H12C12.6213 12.875 13.125 13.3787 13.125 14C13.125 14.6213 12.6213 15.125 12 15.125H8C6.11033 15.125 4.29806 14.3743 2.96186 13.0381C1.62567 11.7019 0.875 9.88967 0.875 8C0.875 6.11033 1.62567 4.29806 2.96186 2.96186C4.29806 1.62567 6.11033 0.875 8 0.875H12C12.6213 0.875 13.125 1.37868 13.125 2C13.125 2.62132 12.6213 3.125 12 3.125H8Z" />
      <path d="M16.875 2C16.875 1.37868 17.3787 0.875 18 0.875H22C23.8897 0.875 25.7019 1.62567 27.0381 2.96186C28.3743 4.29806 29.125 6.11033 29.125 8C29.125 9.88967 28.3743 11.7019 27.0381 13.0381C25.7019 14.3743 23.8897 15.125 22 15.125H18C17.3787 15.125 16.875 14.6213 16.875 14C16.875 13.3787 17.3787 12.875 18 12.875H22C23.2929 12.875 24.5329 12.3614 25.4471 11.4471C26.3614 10.5329 26.875 9.29293 26.875 8C26.875 6.70707 26.3614 5.46709 25.4471 4.55285C24.5329 3.63861 23.2929 3.125 22 3.125H18C17.3787 3.125 16.875 2.62132 16.875 2Z" />
      <path d="M9.20557 6.875C8.58425 6.875 8.08057 7.37868 8.08057 8C8.08057 8.62132 8.58425 9.125 9.20557 9.125H20.9193C21.5406 9.125 22.0443 8.62132 22.0443 8C22.0443 7.37868 21.5406 6.875 20.9193 6.875H9.20557Z" />
    </svg>
  )
}

export default SvgLinkOutline
