import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import logo from '../assets/adobelogo.svg'
import { getLogoHref } from '../utils/navigation'

function AuthLayout({ step, question, children, footerText, footerLink }) {
  const logoHref = getLogoHref()

  return (
      <div className="relative flex min-h-screen items-center justify-center bg-white px-4 text-[#0d2a6b] sm:px-6">
        <Link
          to={logoHref}
          className="absolute left-6 top-8 inline-flex items-center sm:left-10 sm:top-10"
        >
          <img src={logo} alt="pmmp.club" className="h-14 w-auto" />
        </Link>
        <div className="w-full max-w-xl flex flex-col px-4 py-16 sm:px-10">
          <div className="mb-12" />
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-black">{step}</span>
            <span className="text-4xl font-bold leading-none text-black">→</span>
            <h1 className="text-[32px] font-semibold text-black sm:text-[36px]">{question}</h1>
          </div>
  <div className="mt-6 flex-1">{children}</div>

        <div className="mt-20 text-base text-[#1a1f33]">
          {footerText}{' '}
          <Link className="font-semibold text-[#102f76] underline decoration-2 underline-offset-4" to={footerLink.href}>
            {footerLink.label}
          </Link>
        </div>
      </div>
    </div>
  )
}

AuthLayout.propTypes = {
  step: PropTypes.string.isRequired,
  question: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  footerText: PropTypes.string,
  footerLink: PropTypes.shape({
    href: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  }).isRequired,
}

AuthLayout.defaultProps = {
  footerText: '',
}

export default AuthLayout
