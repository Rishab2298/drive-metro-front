import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Award, 
  Package, 
  AlertCircle, 
  CheckCircle, 
  Camera,
  Shield,
  Car,
  Clock
} from 'lucide-react';

const DriverScorecard = () => {
    const driverData = {
  "transporterId": "A3AHESB408LBV7",
  "name": "Adam LeMaster",
  "firstName": "Adam",
  "lastName": "LeMaster",
  "packagesDelivered": 709,
  "ficoScore": 0,
  "seatbeltOffRate": 100,
  "speedingEventRate": 100,
  "distractionsRate": 0.4,
  "followingDistanceRate": 100,
  "signalViolationsRate": 0,
  "cdfDpmo": 1410,
  "customerEscalationDefect": 0,
  "deliveryCompletionRate": 99.7,
  "deliverySuccessBehaviors": 1410,
  "podAcceptanceRate": 98,
  "overallStanding": "Platinum",
  "tier": "Gold",
  "distractionRate": 75,
  "cdf": 62.75,
  "ced": 100,
  "dcr": 87.2,
  "dsb": 0,
  "pod": 74.8,
  "podOpportunities": 498,
  "podSuccess": 488,
  "podBypass": 0,
  "podRejects": 10,
  "podRejectsBreakdown_blurryPhoto": 2,
  "podRejectsBreakdown_humanInPicture": 0,
  "podRejectsBreakdown_noPackageDetected": 6,
  "podRejectsBreakdown_packageInCar": 0,
  "podRejectsBreakdown_packageInHand": 0,
  "podRejectsBreakdown_packageNotClearlyVisible": 0,
  "podRejectsBreakdown_packageTooClose": 1,
  "podRejectsBreakdown_photoTooDark": 1,
  "podRejectsBreakdown_other": 0,
  "podQualityScore": 97.99,
  "historicalData": "[{\"week\":0,\"year\":null,\"metrics\":{\"overallStanding\":\"Platinum\",\"tier\":\"Platinum\",\"cdf\":0,\"dcr\":98.4,\"dsb\":37.26,\"pod\":76.81}}]",
  "ppsComplianceRate": 0,
  "ppsTotalStops": 59,
  "ppsCompliantStops": 0,
  "dvicComplianceRate": 100,
  "dvicTotalInspections": 3,
  "dvicOnTimeCount": 3,
  "pawPrintComplianceRate": 0,
  "pawPrintTotal": 0,
  "pawPrintSent": 0
};
  // Helper function to get status color
  const getScoreColor = (value, thresholds = { excellent: 95, good: 85, warning: 70 }) => {
    if (value >= thresholds.excellent) return 'text-green-600 bg-green-50 border-green-200';
    if (value >= thresholds.good) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (value >= thresholds.warning) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  // Helper function to get tier badge styling
  const getTierBadge = (tier) => {
    const styles = {
      Platinum: 'bg-linear-to-r from-gray-400 to-gray-300 text-gray-900',
      Gold: 'bg-linear-to-r from-yellow-400 to-yellow-300 text-yellow-900',
      Silver: 'bg-linear-to-r from-gray-300 to-gray-200 text-gray-700',
      Bronze: 'bg-linear-to-r from-orange-400 to-orange-300 text-orange-900'
    };
    return styles[tier] || 'bg-gray-200 text-gray-700';
  };

  // Calculate POD reject rate
  const podRejectRate = driverData.podOpportunities > 0 
    ? ((driverData.podRejects / driverData.podOpportunities) * 100).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="bg-linear-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-1">{driverData.name}</h1>
              <p className="text-blue-100">ID: {driverData.transporterId}</p>
              <div className="flex items-center gap-2 mt-3">
                <Package className="w-5 h-5" />
                <span className="text-lg font-semibold">{driverData.packagesDelivered} Packages Delivered</span>
              </div>
            </div>
            <div className="flex flex-col items-start md:items-end gap-3">
              <div className={`px-6 py-3 rounded-lg font-bold text-lg ${getTierBadge(driverData.tier)} shadow-md`}>
                {driverData.tier} Tier
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
                <Award className="w-5 h-5" />
                <span className="font-semibold">{driverData.overallStanding} Standing</span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Delivery Completion"
            value={`${driverData.dcr}%`}
            icon={<CheckCircle className="w-6 h-6" />}
            status={getScoreColor(driverData.dcr)}
            subtitle="Overall completion rate"
          />
          <MetricCard
            title="POD Acceptance"
            value={`${driverData.pod}%`}
            icon={<Camera className="w-6 h-6" />}
            status={getScoreColor(driverData.pod)}
            subtitle={`${driverData.podSuccess}/${driverData.podOpportunities} accepted`}
          />
          <MetricCard
            title="Customer Escalations"
            value={driverData.ced}
            icon={<AlertCircle className="w-6 h-6" />}
            status={driverData.ced === 100 ? 'text-green-600 bg-green-50 border-green-200' : 'text-red-600 bg-red-50 border-red-200'}
            subtitle="CED Score"
          />
          <MetricCard
            title="POD Quality"
            value={`${driverData.podQualityScore}%`}
            icon={<Award className="w-6 h-6" />}
            status={getScoreColor(driverData.podQualityScore)}
            subtitle="Photo quality score"
          />
        </div>

        {/* Safety Metrics Section */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-7 h-7 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">Safety Performance</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SafetyMetric
              label="Seatbelt Compliance"
              value={driverData.seatbeltOffRate}
              isRate={true}
              inverse={true}
            />
            <SafetyMetric
              label="Speeding Events"
              value={driverData.speedingEventRate}
              isRate={true}
              inverse={true}
            />
            <SafetyMetric
              label="Distractions"
              value={driverData.distractionRate}
              isRate={true}
              inverse={true}
            />
            <SafetyMetric
              label="Following Distance"
              value={driverData.followingDistanceRate}
              isRate={true}
              inverse={true}
            />
            <SafetyMetric
              label="Signal Violations"
              value={driverData.signalViolationsRate}
              isRate={true}
              inverse={true}
            />
            <SafetyMetric
              label="Overall Safety Score"
              value={100 - driverData.cdf}
              isRate={false}
              inverse={false}
            />
          </div>
        </div>

        {/* POD Details Section */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <Camera className="w-7 h-7 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-800">Photo on Delivery (POD) Details</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatBox label="Total Opportunities" value={driverData.podOpportunities} color="bg-blue-50 text-blue-700 border-blue-200" />
            <StatBox label="Successful" value={driverData.podSuccess} color="bg-green-50 text-green-700 border-green-200" />
            <StatBox label="Rejected" value={driverData.podRejects} color="bg-red-50 text-red-700 border-red-200" />
            <StatBox label="Reject Rate" value={`${podRejectRate}%`} color={podRejectRate < 5 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'} />
          </div>

          {driverData.podRejects > 0 && (
            <>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Rejection Reasons Breakdown</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {driverData.podRejectsBreakdown_blurryPhoto > 0 && (
                  <RejectReason label="Blurry Photo" count={driverData.podRejectsBreakdown_blurryPhoto} />
                )}
                {driverData.podRejectsBreakdown_noPackageDetected > 0 && (
                  <RejectReason label="No Package Detected" count={driverData.podRejectsBreakdown_noPackageDetected} />
                )}
                {driverData.podRejectsBreakdown_humanInPicture > 0 && (
                  <RejectReason label="Human in Picture" count={driverData.podRejectsBreakdown_humanInPicture} />
                )}
                {driverData.podRejectsBreakdown_packageInCar > 0 && (
                  <RejectReason label="Package in Car" count={driverData.podRejectsBreakdown_packageInCar} />
                )}
                {driverData.podRejectsBreakdown_packageInHand > 0 && (
                  <RejectReason label="Package in Hand" count={driverData.podRejectsBreakdown_packageInHand} />
                )}
                {driverData.podRejectsBreakdown_packageNotClearlyVisible > 0 && (
                  <RejectReason label="Not Clearly Visible" count={driverData.podRejectsBreakdown_packageNotClearlyVisible} />
                )}
                {driverData.podRejectsBreakdown_packageTooClose > 0 && (
                  <RejectReason label="Package Too Close" count={driverData.podRejectsBreakdown_packageTooClose} />
                )}
                {driverData.podRejectsBreakdown_photoTooDark > 0 && (
                  <RejectReason label="Photo Too Dark" count={driverData.podRejectsBreakdown_photoTooDark} />
                )}
              </div>
            </>
          )}
        </div>

        {/* Compliance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ComplianceCard
            title="PPS Compliance"
            rate={driverData.ppsComplianceRate}
            compliant={driverData.ppsCompliantStops}
            total={driverData.ppsTotalStops}
            icon={<Clock className="w-6 h-6" />}
          />
          <ComplianceCard
            title="DVIC Compliance"
            rate={driverData.dvicComplianceRate}
            compliant={driverData.dvicOnTimeCount}
            total={driverData.dvicTotalInspections}
            icon={<Car className="w-6 h-6" />}
          />
          <ComplianceCard
            title="Paw Print"
            rate={driverData.pawPrintComplianceRate}
            compliant={driverData.pawPrintSent}
            total={driverData.pawPrintTotal}
            icon={<Package className="w-6 h-6" />}
          />
        </div>

        {/* Performance Tips */}
        <div className="bg-linear-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-amber-600" />
            Tips to Improve Your Score
          </h3>
          <ul className="space-y-2 text-gray-700">
            {driverData.pod < 90 && (
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span>Focus on taking clear POD photos - ensure packages are visible, well-lit, and not blurry</span>
              </li>
            )}
            {driverData.dcr < 95 && (
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span>Improve delivery completion rate by attempting all deliveries on your route</span>
              </li>
            )}
            {driverData.distractionRate > 10 && (
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span>Minimize distractions while driving - avoid using your phone while the vehicle is in motion</span>
              </li>
            )}
            {driverData.seatbeltOffRate > 10 && (
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span>Always wear your seatbelt while the vehicle is in motion</span>
              </li>
            )}
          </ul>
        </div>

      </div>
    </div>
  );
};

// Metric Card Component
const MetricCard = ({ title, value, icon, status, subtitle }) => (
  <div className={`border-2 rounded-lg p-4 ${status} transition-all hover:shadow-lg`}>
    <div className="flex items-start justify-between mb-2">
      <h3 className="font-semibold text-sm">{title}</h3>
      {icon}
    </div>
    <div className="text-3xl font-bold mb-1">{value}</div>
    {subtitle && <p className="text-xs opacity-75">{subtitle}</p>}
  </div>
);

// Safety Metric Component
const SafetyMetric = ({ label, value, isRate, inverse }) => {
  const getColor = () => {
    if (inverse) {
      // For metrics where lower is better (like speeding, distractions)
      if (value <= 5) return 'text-green-600 bg-green-50';
      if (value <= 15) return 'text-yellow-600 bg-yellow-50';
      return 'text-red-600 bg-red-50';
    } else {
      // For metrics where higher is better
      if (value >= 90) return 'text-green-600 bg-green-50';
      if (value >= 70) return 'text-yellow-600 bg-yellow-50';
      return 'text-red-600 bg-red-50';
    }
  };

  return (
    <div className={`p-4 rounded-lg ${getColor()} border-2`}>
      <div className="text-sm font-medium opacity-75 mb-1">{label}</div>
      <div className="text-2xl font-bold">{isRate ? `${value}%` : value}</div>
    </div>
  );
};

// Stat Box Component
const StatBox = ({ label, value, color }) => (
  <div className={`${color} border-2 rounded-lg p-4 text-center`}>
    <div className="text-2xl font-bold mb-1">{value}</div>
    <div className="text-xs font-medium">{label}</div>
  </div>
);

// Reject Reason Component
const RejectReason = ({ label, count }) => (
  <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-lg p-3">
    <span className="text-sm text-red-700 font-medium">{label}</span>
    <span className="bg-red-600 text-white text-sm font-bold rounded-full w-7 h-7 flex items-center justify-center">
      {count}
    </span>
  </div>
);

// Compliance Card Component
const ComplianceCard = ({ title, rate, compliant, total, icon }) => {
  const getColor = () => {
    if (rate >= 95) return 'border-green-500 bg-green-50';
    if (rate >= 80) return 'border-yellow-500 bg-yellow-50';
    return 'border-red-500 bg-red-50';
  };

  return (
    <div className={`border-2 rounded-lg p-5 ${getColor()}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-gray-800">{title}</h3>
        {icon}
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-2">{rate}%</div>
      <p className="text-sm text-gray-600">
        {compliant} of {total} compliant
      </p>
    </div>
  );
};

export default DriverScorecard;