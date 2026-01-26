import { Link } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';

const Footer = () => {
  const footerLinks = {
    Product: [
      { name: 'Features', href: '/#features' },
      { name: 'Pricing', href: '/#pricing' },
      { name: 'How It Works', href: '/#how-it-works' },
    ],
    Support: [
      { name: 'Contact Us', href: '/contact' },
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-8">
          {/* Brand */}
          <div className="max-w-xs">
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
            <p className="text-slate-600 dark:text-slate-500 text-sm leading-relaxed">
              Transforming last-mile delivery performance through intelligent scorecards and AI-powered insights.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-12">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">{title}</h4>
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
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-slate-200 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 dark:text-slate-600 text-sm">
            &copy; {new Date().getFullYear()} DiveMetric. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
