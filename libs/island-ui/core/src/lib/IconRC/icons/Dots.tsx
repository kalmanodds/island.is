import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgDots = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="dots_svg__ionicon"
      viewBox="0 0 16 16"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path
        d="M3.25 5C2.90388 5 2.56554 4.89737 2.27775 4.70507C1.98997 4.51278 1.76566 4.23947 1.63321 3.9197C1.50076 3.59993 1.4661 3.24806 1.53363 2.90859C1.60115 2.56913 1.76782 2.25731 2.01256 2.01256C2.25731 1.76782 2.56913 1.60115 2.90859 1.53363C3.24806 1.4661 3.59993 1.50076 3.9197 1.63321C4.23947 1.76566 4.51278 1.98997 4.70507 2.27775C4.89737 2.56554 5 2.90388 5 3.25C4.9995 3.71398 4.81497 4.15881 4.48689 4.48689C4.15881 4.81497 3.71398 4.9995 3.25 5ZM8 5C7.65388 5 7.31554 4.89737 7.02775 4.70507C6.73997 4.51278 6.51567 4.23947 6.38321 3.9197C6.25076 3.59993 6.2161 3.24806 6.28363 2.90859C6.35115 2.56913 6.51782 2.25731 6.76256 2.01256C7.00731 1.76782 7.31913 1.60115 7.65859 1.53363C7.99806 1.4661 8.34993 1.50076 8.6697 1.63321C8.98947 1.76566 9.26278 1.98997 9.45507 2.27775C9.64737 2.56554 9.75 2.90388 9.75 3.25C9.74951 3.71398 9.56497 4.15881 9.23689 4.48689C8.90881 4.81497 8.46398 4.9995 8 5ZM12.75 5C12.4039 5 12.0655 4.89737 11.7778 4.70507C11.49 4.51278 11.2657 4.23947 11.1332 3.9197C11.0008 3.59993 10.9661 3.24806 11.0336 2.90859C11.1012 2.56913 11.2678 2.25731 11.5126 2.01256C11.7573 1.76782 12.0691 1.60115 12.4086 1.53363C12.7481 1.4661 13.0999 1.50076 13.4197 1.63321C13.7395 1.76566 14.0128 1.98997 14.2051 2.27775C14.3974 2.56554 14.5 2.90388 14.5 3.25C14.4995 3.71398 14.315 4.15881 13.9869 4.48689C13.6588 4.81497 13.214 4.9995 12.75 5ZM3.25 9.75C2.90388 9.75 2.56554 9.64737 2.27775 9.45507C1.98997 9.26278 1.76566 8.98947 1.63321 8.6697C1.50076 8.34993 1.4661 7.99806 1.53363 7.65859C1.60115 7.31913 1.76782 7.00731 2.01256 6.76256C2.25731 6.51782 2.56913 6.35115 2.90859 6.28363C3.24806 6.2161 3.59993 6.25076 3.9197 6.38321C4.23947 6.51567 4.51278 6.73997 4.70507 7.02775C4.89737 7.31554 5 7.65388 5 8C4.9995 8.46398 4.81497 8.90881 4.48689 9.23689C4.15881 9.56497 3.71398 9.74951 3.25 9.75ZM8 9.75C7.65388 9.75 7.31554 9.64737 7.02775 9.45507C6.73997 9.26278 6.51567 8.98947 6.38321 8.6697C6.25076 8.34993 6.2161 7.99806 6.28363 7.65859C6.35115 7.31913 6.51782 7.00731 6.76256 6.76256C7.00731 6.51782 7.31913 6.35115 7.65859 6.28363C7.99806 6.2161 8.34993 6.25076 8.6697 6.38321C8.98947 6.51567 9.26278 6.73997 9.45507 7.02775C9.64737 7.31554 9.75 7.65388 9.75 8C9.74951 8.46398 9.56497 8.90881 9.23689 9.23689C8.90881 9.56497 8.46398 9.74951 8 9.75ZM12.75 9.75C12.4039 9.75 12.0655 9.64737 11.7778 9.45507C11.49 9.26278 11.2657 8.98947 11.1332 8.6697C11.0008 8.34993 10.9661 7.99806 11.0336 7.65859C11.1012 7.31913 11.2678 7.00731 11.5126 6.76256C11.7573 6.51782 12.0691 6.35115 12.4086 6.28363C12.7481 6.2161 13.0999 6.25076 13.4197 6.38321C13.7395 6.51567 14.0128 6.73997 14.2051 7.02775C14.3974 7.31554 14.5 7.65388 14.5 8C14.4995 8.46398 14.315 8.90881 13.9869 9.23689C13.6588 9.56497 13.214 9.74951 12.75 9.75ZM3.25 14.5C2.90388 14.5 2.56554 14.3974 2.27775 14.2051C1.98997 14.0128 1.76566 13.7395 1.63321 13.4197C1.50076 13.0999 1.4661 12.7481 1.53363 12.4086C1.60115 12.0691 1.76782 11.7573 2.01256 11.5126C2.25731 11.2678 2.56913 11.1012 2.90859 11.0336C3.24806 10.9661 3.59993 11.0008 3.9197 11.1332C4.23947 11.2657 4.51278 11.49 4.70507 11.7778C4.89737 12.0655 5 12.4039 5 12.75C4.9995 13.214 4.81497 13.6588 4.48689 13.9869C4.15881 14.315 3.71398 14.4995 3.25 14.5ZM8 14.5C7.65388 14.5 7.31554 14.3974 7.02775 14.2051C6.73997 14.0128 6.51567 13.7395 6.38321 13.4197C6.25076 13.0999 6.2161 12.7481 6.28363 12.4086C6.35115 12.0691 6.51782 11.7573 6.76256 11.5126C7.00731 11.2678 7.31913 11.1012 7.65859 11.0336C7.99806 10.9661 8.34993 11.0008 8.6697 11.1332C8.98947 11.2657 9.26278 11.49 9.45507 11.7778C9.64737 12.0655 9.75 12.4039 9.75 12.75C9.74951 13.214 9.56497 13.6588 9.23689 13.9869C8.90881 14.315 8.46398 14.4995 8 14.5ZM12.75 14.5C12.4039 14.5 12.0655 14.3974 11.7778 14.2051C11.49 14.0128 11.2657 13.7395 11.1332 13.4197C11.0008 13.0999 10.9661 12.7481 11.0336 12.4086C11.1012 12.0691 11.2678 11.7573 11.5126 11.5126C11.7573 11.2678 12.0691 11.1012 12.4086 11.0336C12.7481 10.9661 13.0999 11.0008 13.4197 11.1332C13.7395 11.2657 14.0128 11.49 14.2051 11.7778C14.3974 12.0655 14.5 12.4039 14.5 12.75C14.4995 13.214 14.315 13.6588 13.9869 13.9869C13.6588 14.315 13.214 14.4995 12.75 14.5Z"
        fill="#0061FF"
      />
    </svg>
  )
}

export default SvgDots
