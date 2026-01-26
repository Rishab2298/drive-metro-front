import { Link } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';

const Footer = () => {
  const footerLinks = {
    Product: [
      { name: 'Features', href: '/#features' },
      { name: 'Pricing', href: '/#pricing' },
      { name: 'How It Works', href: '/#how-it-works' },
    ],
    Company: [
      { name: 'About', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'Careers', href: '#' },
    ],
    Resources: [
      { name: 'Help Center', href: '#' },
      { name: 'Documentation', href: '#' },
      { name: 'API', href: '#' },
    ],
    Legal: [
      { name: 'Privacy', href: '#' },
      { name: 'Terms', href: '#' },
      { name: 'Contact', href: '/contact' },
    ],
  };

  return (
    <footer className="relative bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-white/5">
      <div
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99, 102, 241, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-500 rounded-xl blur-lg opacity-50 group-hover:opacity-80 transition-opacity" />
                <div className="relative bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-500 p-2 rounded-xl">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                DiveMetric
              </span>
            </Link>
            <p className="text-slate-600 dark:text-slate-500 text-sm mb-4 leading-relaxed max-w-xs">
              Transforming last-mile delivery performance through intelligent scorecards and AI-powered insights.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    {link.href.startsWith('/') ? (
                      <Link
                        to={link.href}
                        className="text-slate-600 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white text-sm transition-colors"
                      >
                        {link.name}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-slate-600 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white text-sm transition-colors"
                      >
                        {link.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-slate-200 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 dark:text-slate-600 text-sm">
            &copy; {new Date().getFullYear()} DiveMetric. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {['twitter', 'linkedin', 'github'].map((social) => (
              <a
                key={social}
                href="#"
                className="w-9 h-9 rounded-lg bg-slate-200 dark:bg-white/5 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 border border-slate-300 dark:border-white/5 hover:border-indigo-300 dark:hover:border-indigo-500/30 flex items-center justify-center text-slate-600 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-white transition-all duration-300"
              >
                {social === 'twitter' && (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                )}
                {social === 'linkedin' && (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                )}
                {social === 'github' && (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                )}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
