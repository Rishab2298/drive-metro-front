import { SignIn } from '@clerk/clerk-react';
import { BarChart3, Shield, CheckCircle2 } from 'lucide-react';

const SignInPage = () => {
  const features = [
    "Real-time analytics dashboard",
    "Advanced reporting tools",
    "Enterprise-grade security",
    "24/7 customer support"
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Column - Dark Background */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 text-white p-12 xl:p-16 flex-col justify-between">
        <div>
          {/* Logo */}
          <div className="mb-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">DiveMetric</h1>
                <p className="text-xs text-slate-400">Analytics Platform</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-md">
            <h2 className="text-4xl font-bold mb-6">
              Welcome back
            </h2>
            <p className="text-lg text-slate-300 mb-12">
              Sign in to access your analytics dashboard and continue making data-driven decisions.
            </p>

            {/* Features */}
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0" />
                  <span className="text-slate-200">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-6 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span>SOC 2 Certified</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-slate-600"></div>
          <span>ISO 27001</span>
          <div className="w-1 h-1 rounded-full bg-slate-600"></div>
          <span>GDPR Compliant</span>
        </div>
      </div>

      {/* Right Column - White Background */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-900">DiveMetric</h1>
            </div>
          </div>

          {/* Sign In Form */}
          <div>
           

            <SignIn
              
            />

           
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
