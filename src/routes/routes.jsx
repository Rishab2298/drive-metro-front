import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import PublicRoute from "../components/PublicRoute";
import ClientAppLayout from "../components/layouts/ClientAppLayout";

import LandingPage from "../pages/public/landingPage";
import SignIn from "../pages/public/signIn";
import SignUp from "../pages/public/signUp";
import ScorecardSamplesDemo from "../pages/public/ScorecardSamplesDemo";
import ScorecardView from "../pages/public/scorecardView";
import HowScoringWorks from "../pages/public/HowScoringWorks";
import ClientDashboard from "../pages/client/clientDashboard";
import GettingStarted from "../pages/client/gettingStarted";
import Onboarding from "../pages/client/onboarding";
import UploadScorecard from "../pages/client/scorecard/uploadScorecard";
import ProcessingResults from "../pages/client/scorecard/processingResults";
import ViewScorecards from "../pages/client/scorecard/viewScorecards";
import MasterScorecardDetail from "../pages/client/scorecard/masterScorecardDetail";
import ManageDrivers from "../pages/client/drivers/manageDrivers";
import GeneralSettings from "../pages/client/settings/generalSettings";
import Billing from "../pages/client/billing/billing";
import DriverScorecard from "../sampleScorecard";

const wrapRoute = (Component, Wrapper, Layout) => {
  const content = <Component />;
  const withLayout = Layout ? <Layout>{content}</Layout> : content;
  return Wrapper ? <Wrapper>{withLayout}</Wrapper> : withLayout;
};

const routeConfig = [
  { path: "/", component: LandingPage, wrapper: PublicRoute },
  { path: "/sign-in", component: SignIn, wrapper: PublicRoute },
  { path: "/sign-up", component: SignUp, wrapper: PublicRoute },
  { path: "/scorecard-samples", component: ScorecardSamplesDemo },
  { path: "/scorecard/:id", component: ScorecardView },
  { path: "/how-scoring-works", component: HowScoringWorks },
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
];

export const router = createBrowserRouter(
  routeConfig.map(({ path, component: Component, wrapper, layout }) => ({
    path,
    element: wrapRoute(Component, wrapper, layout),
  }))
);
