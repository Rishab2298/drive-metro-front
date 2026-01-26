import { SignUp } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { TrendingUp, Shield, CheckCircle2, Sparkles, Clock, CreditCard, ArrowLeft } from 'lucide-react';

const SignUpPage = () => {
  const features = [
    { text: "30-day free trial included", icon: Clock },
    { text: "No credit card required", icon: CreditCard },
    { text: "AI-powered coaching insights", icon: Sparkles },
    { text: "Cancel anytime, no questions", icon: CheckCircle2 },
  ];

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Global Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-br from-slate-950 via-[#0c0a1d] to-slate-950" />
        <div className="absolute top-0 right-1/4 w-[800px] h-[800px] rounded-full bg-linear-to-br from-violet-600/20 to-transparent blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] rounded-full bg-linear-to-br from-indigo-600/15 to-transparent blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(99, 102, 241, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(99, 102, 241, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Left Column - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10 p-12 xl:p-16 flex-col justify-between">
        <div>
          {/* Back to Home */}
          <Link to="/home" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-12 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Back to home</span>
          </Link>

          {/* Logo */}
          <div className="mb-16">
            <Link to="/home" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-br from-indigo-500 via-violet-500 to-pink-500 rounded-xl blur-lg opacity-50 group-hover:opacity-80 transition-all duration-500" />
                <div className="relative bg-linear-to-br from-indigo-500 via-violet-500 to-pink-500 p-2.5 rounded-xl shadow-lg">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">DiveMetric</h1>
                <p className="text-xs text-slate-500">Performance Management</p>
              </div>
            </Link>
          </div>

          {/* Main Content */}
          <div className="max-w-md">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-300">30-Day Free Trial</span>
            </div>
            <h2 className="text-4xl font-black mb-6 text-white">
              Start driving excellence today
            </h2>
            <p className="text-lg text-slate-400 mb-12 leading-relaxed">
              Join <span className="text-white font-semibold">200+ DSPs</span> using DiveMetric to transform driver performance with
              <span className="text-indigo-400 font-medium"> AI-powered insights</span>.
            </p>

            {/* Features */}
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] hover:border-emerald-500/20 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-linear-to-br from-emerald-500/20 to-indigo-500/20 flex items-center justify-center">
                    <feature.icon className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-slate-300 text-sm">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-6 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-400" />
            <span>Enterprise Security</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-slate-700" />
          <span>99.9% Uptime</span>
          <div className="w-1 h-1 rounded-full bg-slate-700" />
          <span>SOC 2 Compliant</span>
        </div>
      </div>

      {/* Right Column - Sign Up Form */}
      <div className="w-full lg:w-1/2 relative z-10 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden mb-8">
            <Link to="/home" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back</span>
            </Link>
            <Link to="/home" className="flex items-center gap-3 mb-6">
              <div className="bg-linear-to-br from-indigo-500 via-violet-500 to-pink-500 p-2 rounded-xl">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">DiveMetric</h1>
            </Link>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span className="text-xs font-semibold text-emerald-300">30-Day Free Trial</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Create your account</h2>
            <p className="text-slate-400 text-sm">Start your free trial today</p>
          </div>

          {/* Sign Up Form Container */}
          <div className="relative">
            <div className="absolute -inset-1 bg-linear-to-r from-indigo-500/20 via-violet-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-50" />
            <div className="relative bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
              <SignUp
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "bg-transparent shadow-none p-0",
                    headerTitle: "text-white text-xl font-bold",
                    headerSubtitle: "text-slate-400",
                    socialButtonsBlockButton: "bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all",
                    socialButtonsBlockButtonText: "text-white font-medium",
                    dividerLine: "bg-white/10",
                    dividerText: "text-slate-500",
                    formFieldLabel: "text-slate-300 font-medium",
                    formFieldInput: "bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20",
                    formButtonPrimary: "bg-linear-to-r from-indigo-500 via-violet-500 to-pink-500 hover:from-indigo-600 hover:via-violet-600 hover:to-pink-600 text-white font-semibold shadow-lg shadow-indigo-500/25",
                    footerActionLink: "text-indigo-400 hover:text-indigo-300",
                    identityPreviewEditButton: "text-indigo-400 hover:text-indigo-300",
                    formFieldInputShowPasswordButton: "text-slate-400 hover:text-white",
                    alert: "bg-rose-500/10 border border-rose-500/20 text-rose-300",
                    alertText: "text-rose-300",
                  },
                }}
              />
            </div>
          </div>

          {/* Bottom text */}
          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/sign-in" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
