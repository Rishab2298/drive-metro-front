const Footer = () => {
  return (
    <footer className="bg-[var(--landing-bg-primary)] border-t border-[var(--landing-border)] py-12">
      <div className="max-w-[1290px] mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          {/* Logo and Description */}
          <div className="max-w-md">
            <img
              src="/logo.png"
              alt="DiveMetric Logo"
              className="h-8 w-8 mb-4"
            />
            <p className="text-[var(--landing-text-secondary)] leading-[1.625]">
              Elementra is a web application company focused on building scalable digital products through innovative engineering and user-centric solutions.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h6 className="font-heading text-[19px] font-medium text-[var(--landing-text-primary)] mb-3">
              Contact
            </h6>
            <a
              href="mailto:info@email.com"
              className="text-[var(--landing-primary)] hover:text-[var(--landing-primary-dark)] transition-colors duration-300"
            >
              info@email.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
