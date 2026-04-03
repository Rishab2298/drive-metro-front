import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';

const LINKS = {
  Product: [
    { name: 'Features',         href: '/features' },
    { name: 'AI Features',      href: '/ai-features' },
    { name: 'Pricing',          href: '/pricing' },
    { name: 'Sample Scorecard', href: '/sample-scorecard' },
  ],
  Learn: [
    { name: 'How It Works',     href: '/how-scoring-works' },
    { name: 'FAQ',              href: '/faq' },
    { name: 'Contact Us',       href: '/contact' },
  ],
  Account: [
    { name: 'Sign In',          href: '/sign-in' },
    { name: 'Sign Up',          href: '/sign-up' },
  ],
  Legal: [
    { name: 'Privacy Policy',   href: '/privacy-policy' },
    { name: 'Terms of Service', href: '/terms-of-service' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-apple-dark">
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-10">

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 pb-12 border-b border-white/10">

          {/* Brand — 2 cols */}
          <div className="md:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-5 group">
              <img src={logo} alt="DiveMetric" className="h-7 w-7 opacity-90 group-hover:opacity-100 transition-opacity duration-200" />
              <span className="text-[17px] font-bold tracking-[-0.5px] text-white">DiveMetric</span>
            </Link>

            <p className="text-[14px] text-white/50 leading-relaxed max-w-60 mb-7">
              The scorecard platform built for Amazon DSP owners. Hit Fantastic+ every week.
            </p>

            <Link
              to="/sign-up"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-apple-blue hover:bg-apple-blueDark text-white text-[14px] font-semibold rounded-full shadow-[0_2px_8px_rgba(0,122,255,0.35)] hover:shadow-[0_4px_16px_rgba(0,122,255,0.4)] transition-all duration-150 active:scale-95"
            >
              Try 30 Days Free →
            </Link>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-white/30 mb-4">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-[14px] font-medium text-white/55 hover:text-white transition-colors duration-150"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-8">
          <p className="text-[13px] text-white/30">
            © {new Date().getFullYear()} Kilimanjaro Innovation Labs Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-[13px] text-white/30">Trusted by 500+ DSP owners Globally</p>
          </div>
        </div>

      </div>
    </footer>
  );
}
