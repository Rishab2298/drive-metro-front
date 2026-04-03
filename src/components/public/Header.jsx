import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png';

const NAV_LINKS = [
  { name: 'Features',    href: '/features' },
  { name: 'Pricing',     href: '/pricing' },
  { name: 'FAQ',         href: '/faq' },
  { name: 'Contact',     href: '/contact' },
  { name: 'AI Coaching', href: '/ai-features', ai: true },
];

function SparkleIcon() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 0 L9.2 5.8 L15 8 L9.2 10.2 L8 16 L6.8 10.2 L1 8 L6.8 5.8 Z" />
    </svg>
  );
}

export default function Header() {
  const [scrolled, setScrolled]       = useState(false);
  const [menuOpen, setMenuOpen]       = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      setMenuVisible(true);
    } else {
      const t = setTimeout(() => setMenuVisible(false), 220);
      return () => clearTimeout(t);
    }
  }, [menuOpen]);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const isActive = (href) => location.pathname === href;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-200 ${scrolled ? 'shadow-[0_2px_12px_rgba(0,0,0,0.07)]' : 'border-b border-apple-border/50'}`}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <img src={logo} alt="DiveMetric" className="h-7 w-7 transition-transform duration-200 group-hover:scale-105" />
            <span className="text-[17px] font-bold tracking-[-0.5px] text-apple-dark">DiveMetric</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              if (link.ai) {
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="relative flex items-center gap-1.5 px-3.5 py-2 text-[14px] font-semibold rounded-lg transition-all duration-150 hover:bg-purple-50/60"
                  >
                    
                    {/* gradient text */}
                    <span
                      className="bg-clip-text text-transparent"
                      style={{ backgroundImage: 'linear-gradient(90deg, #7C3AED, #EC4899)' }}
                    >
                      {link.name}
                    </span>
                    {/* NEW badge */}
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white"
                      style={{ backgroundImage: 'linear-gradient(90deg, #7C3AED, #EC4899)' }}>
                      AI
                    </span>
                  </Link>
                );
              }
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`px-3.5 py-2 text-[14px] font-medium rounded-lg transition-all duration-150 ${
                    active
                      ? 'text-apple-blue'
                      : 'text-apple-mid hover:text-apple-dark hover:bg-apple-gray'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/sign-in"
              className="px-4 py-2 text-[14px] font-medium text-apple-mid hover:text-apple-dark hover:bg-apple-gray rounded-lg transition-all duration-150"
            >
              Sign In
            </Link>
            <Link
              to="/sign-up"
              className="px-5 py-2.5 bg-apple-blue hover:bg-apple-blueDark text-white text-[14px] font-semibold rounded-full shadow-[0_2px_8px_rgba(0,122,255,0.28)] hover:shadow-[0_4px_14px_rgba(0,122,255,0.34)] transition-all duration-150 active:scale-95"
            >
              Try for Free
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl text-apple-dark hover:bg-apple-gray transition-colors duration-150"
          >
            <div className="relative w-5 h-5">
              <span className={`absolute left-0 block h-[1.5px] w-5 bg-current rounded-full transition-all duration-200 ${menuOpen ? 'top-2.5 rotate-45' : 'top-1'}`} />
              <span className={`absolute left-0 top-2.5 block h-[1.5px] bg-current rounded-full transition-all duration-200 ${menuOpen ? 'opacity-0 w-0' : 'w-4 opacity-100'}`} />
              <span className={`absolute left-0 block h-[1.5px] w-5 bg-current rounded-full transition-all duration-200 ${menuOpen ? 'top-2.5 -rotate-45' : 'top-4'}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuVisible && (
        <div className={`md:hidden border-t border-apple-border/50 transition-all duration-220 ${menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="max-w-6xl mx-auto px-6 py-3">
            <nav className="flex flex-col gap-0.5 mb-4">
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href);
                if (link.ai) {
                  return (
                    <Link
                      key={link.name}
                      to={link.href}
                      className="flex items-center gap-2 px-4 py-3 text-[15px] font-semibold rounded-xl transition-all duration-150 hover:bg-purple-50/60"
                    >
                      <span className="bg-gradient-to-r from-violet-500 to-pink-500 rounded-md p-[3px] flex items-center justify-center text-white">
                        <SparkleIcon />
                      </span>
                      <span
                        className="bg-clip-text text-transparent"
                        style={{ backgroundImage: 'linear-gradient(90deg, #7C3AED, #EC4899)' }}
                      >
                        {link.name}
                      </span>
                      <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white"
                        style={{ backgroundImage: 'linear-gradient(90deg, #7C3AED, #EC4899)' }}>
                        AI
                      </span>
                    </Link>
                  );
                }
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={`px-4 py-3 text-[15px] font-medium rounded-xl transition-all duration-150 ${
                      active ? 'text-apple-blue bg-blue-50' : 'text-apple-dark hover:bg-apple-gray'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
            <div className="flex flex-col gap-2 pt-3 border-t border-apple-border/50">
              <Link to="/sign-in">
                <button className="w-full py-3 text-[15px] font-medium text-apple-dark hover:bg-apple-gray rounded-xl transition-colors duration-150">
                  Sign In
                </button>
              </Link>
              <Link to="/sign-up">
                <button className="w-full py-3 text-[15px] font-semibold text-white bg-apple-blue hover:bg-apple-blueDark rounded-full transition-colors duration-150">
                  Try for Free
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
