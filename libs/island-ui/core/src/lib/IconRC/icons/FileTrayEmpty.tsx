import * as React from 'react'
import type { SvgProps as SVGRProps } from '../types'

const SvgFileTrayEmpty = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="file_tray_empty"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="m479.66 268.7-32-151.81C441.48 83.77 417.68 64 384 64H128c-16.8 0-31 4.69-42.1 13.94s-18.37 22.31-21.58 38.89l-32 151.87A16.65 16.65 0 0 0 32 272v112a64 64 0 0 0 64 64h320a64 64 0 0 0 64-64V272a16.65 16.65 0 0 0-.34-3.3zm-384-145.4v-.28c3.55-18.43 13.81-27 32.29-27H384c18.61 0 28.87 8.55 32.27 26.91 0 .13.05.26.07.39l26.93 127.88a4 4 0 0 1-3.92 4.82H320a15.92 15.92 0 0 0-16 15.82 48 48 0 1 1-96 0A15.92 15.92 0 0 0 192 256H72.65a4 4 0 0 1-3.92-4.82z" />
    </svg>
  )
}

export default SvgFileTrayEmpty
