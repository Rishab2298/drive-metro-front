import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Menu, X, ArrowRight, TrendingUp } from 'lucide-react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { setTheme } = useTheme();
  const location = useLocation();
  const isHomePage = location.pathname === '/' || location.pathname === '/home';

  // Set dark mode as default
  useEffect(() => {
    setTheme('dark');
  }, [setTheme]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', href: isHomePage ? '#features' : '/#features' },
    { name: 'How It Works', href: isHomePage ? '#how-it-works' : '/#how-it-works' },
    { name: 'Benefits', href: isHomePage ? '#benefits' : '/#benefits' },
    { name: 'Pricing', href: isHomePage ? '#pricing' : '/#pricing' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'py-3' : 'py-5'}`}>
      <div className={`mx-4 md:mx-8 transition-all duration-500 rounded-2xl ${
        isScrolled
          ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-indigo-500/5'
          : ''
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-500 rounded-xl blur-lg opacity-50 group-hover:opacity-80 transition-all duration-500" />
                <div className="relative bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-500 p-2.5 rounded-xl shadow-lg">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white">
                DiveMetric
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                link.href.startsWith('/') ? (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="relative px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-300 group"
                  >
                    <span className="relative z-10">{link.name}</span>
                    <div className="absolute inset-0 bg-slate-100 dark:bg-white/5 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300" />
                  </Link>
                ) : (
                  <a
                    key={link.name}
                    href={link.href}
                    className="relative px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-300 group"
                  >
                    <span className="relative z-10">{link.name}</span>
                    <div className="absolute inset-0 bg-slate-100 dark:bg-white/5 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300" />
                  </a>
                )
              ))}
            </nav>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link to="/sign-in">
                <button className="px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors rounded-xl hover:bg-slate-100 dark:hover:bg-white/5">
                  Sign In
                </button>
              </Link>
              <Link to="/sign-up">
                <button className="group relative px-6 py-2.5 rounded-xl font-semibold text-white text-sm overflow-hidden shadow-lg shadow-indigo-500/20">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500" />
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative flex items-center gap-2">
                    Start Free Trial
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </button>
              </Link>
            </div>

            {/* Mobile: Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 transition-all"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={isMobileMenuOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        className="md:hidden overflow-hidden"
      >
        <div className="mx-4 mt-2 p-4 bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              link.href.startsWith('/') ? (
                <Link
                  key={link.name}
                  to={link.href}
                  className="px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-all"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  className="px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-all"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              )
            ))}
          </nav>
          <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-slate-200 dark:border-white/10">
            <Link to="/sign-in" onClick={() => setIsMobileMenuOpen(false)}>
              <button className="w-full py-3 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all">
                Sign In
              </button>
            </Link>
            <Link to="/sign-up" onClick={() => setIsMobileMenuOpen(false)}>
              <button className="w-full py-3 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500">
                Start Free Trial
              </button>
            </Link>
          </div>
        </div>
      </motion.div>
    </header>
  );
};

export default Header;
