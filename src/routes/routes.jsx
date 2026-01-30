import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import PublicRoute from "../components/PublicRoute";
import ClientAppLayout from "../components/layouts/ClientAppLayout";

// Lazy-load all page components for code splitting
const HomePage = lazy(() => import("../pages/public/HomePage"));
const SignIn = lazy(() => import("../pages/public/signIn"));
const SignUp = lazy(() => import("../pages/public/signUp"));
const ScorecardSamplesDemo = lazy(() => import("../pages/public/ScorecardSamplesDemo"));
const ScorecardView = lazy(() => import("../pages/public/scorecardView"));
const SampleScorecard = lazy(() => import("../pages/public/SampleScorecard"));
const HowScoringWorks = lazy(() => import("../pages/public/HowScoringWorks"));
const ContactPage = lazy(() => import("../pages/public/ContactPage"));
const ClientDashboard = lazy(() => import("../pages/client/clientDashboard"));
const GettingStarted = lazy(() => import("../pages/client/gettingStarted"));
const Onboarding = lazy(() => import("../pages/client/onboarding"));
const UploadScorecard = lazy(() => import("../pages/client/scorecard/uploadScorecard"));
const ProcessingResults = lazy(() => import("../pages/client/scorecard/processingResults"));
const ViewScorecards = lazy(() => import("../pages/client/scorecard/viewScorecards"));
const MasterScorecardDetail = lazy(() => import("../pages/client/scorecard/masterScorecardDetail"));
const ManageDrivers = lazy(() => import("../pages/client/drivers/manageDrivers"));
const GeneralSettings = lazy(() => import("../pages/client/settings/generalSettings"));
const Billing = lazy(() => import("../pages/client/billing/billing"));
const DriverScorecard = lazy(() => import("../sampleScorecard"));
const PrivacyPolicy = lazy(() => import("../pages/references/privacyPolicy"));
const TermsConditions = lazy(() => import("../pages/references/termsConditions"));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
    <div className="w-10 h-10 border-3 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
  </div>
);

const wrapRoute = (Component, Wrapper, Layout) => {
  const content = (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  );
  const withLayout = Layout ? <Layout>{content}</Layout> : content;
  return Wrapper ? <Wrapper>{withLayout}</Wrapper> : withLayout;
};

const routeConfig = [
  { path: "/", component:  HomePage , wrapper: PublicRoute },
  { path: "/home", component: HomePage, wrapper: PublicRoute },
  { path: "/sign-in", component: SignIn, wrapper: PublicRoute },
  { path: "/sign-up", component: SignUp, wrapper: PublicRoute },
  { path: "/scorecard-samples", component: ScorecardSamplesDemo },
  { path: "/scorecard/:id", component: ScorecardView },
  { path: "/sample-scorecard", component: SampleScorecard },
  { path: "/how-scoring-works", component: HowScoringWorks },
  { path: "/contact", component: ContactPage, wrapper: PublicRoute },
  { path: "/onboarding", component: Onboarding, wrapper: ProtectedRoute },
  { path: "/getting-started", component: GettingStarted, wrapper: ProtectedRoute, layout: ClientAppLayout },
  { path: "/upload-scorecard", component: UploadScorecard, wrapper: ProtectedRoute, layout: ClientAppLayout },
  { path: "/processing-results", component: ProcessingResults, wrapper: ProtectedRoute, layout: ClientAppLayout },
  { path: "/view-scorecards", component: ViewScorecards, wrapper: ProtectedRoute, layout: ClientAppLayout },
  { path: "/master-scorecard/:id", component: MasterScorecardDetail, wrapper: ProtectedRoute, layout: ClientAppLayout },
  { path: "/dashboard", component: ClientDashboard, wrapper: ProtectedRoute, layout: ClientAppLayout },
  { path: "/manage-drivers", component: ManageDrivers, wrapper: ProtectedRoute, layout: ClientAppLayout },
  { path: "/settings", component: GeneralSettings, wrapper: ProtectedRoute, layout: ClientAppLayout },
  { path: "/billing", component: Billing, wrapper: ProtectedRoute, layout: ClientAppLayout },
  { path: "/driver-scorecard", component: DriverScorecard, wrapper: ProtectedRoute, layout: ClientAppLayout },
  { path: "/privacy-policy", component: PrivacyPolicy, wrapper: PublicRoute },
  { path: "/terms-of-service", component: TermsConditions, wrapper: PublicRoute },
];

export const router = createBrowserRouter(
  routeConfig.map(({ path, component: Component, wrapper, layout }) => ({
    path,
    element: wrapRoute(Component, wrapper, layout),
  }))
);
