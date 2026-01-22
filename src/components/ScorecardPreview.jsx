import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'

export default function ScorecardPreview({ driver, isOpen, onClose }) {
  if (!driver) return null

  const { firstName, lastName, employeeId, metrics } = driver

  // Helper function to get color based on score
  const getScoreColor = (value, type = 'rate') => {
    if (type === 'rate') {
      if (value >= 99) return 'text-green-600'
      if (value >= 95) return 'text-yellow-600'
      return 'text-red-600'
    }
    if (type === 'safety') {
      if (value <= 0.5) return 'text-green-600'
      if (value <= 2.0) return 'text-yellow-600'
      return 'text-red-600'
    }
    return 'text-gray-900'
  }

  // Helper to format percentage
  const formatPercent = (value) => `${value}%`

  // Helper to format rate per 100
  const formatRate = (value) => `${value}/100`

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {firstName} {lastName}
          </DialogTitle>
          <DialogDescription className="font-mono">
            Employee ID: {employeeId}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Delivery Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Performance</CardTitle>
              <CardDescription>Overall delivery metrics</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Packages Delivered
                  </p>
                  <p className="text-2xl font-bold">
                    {metrics.packagesDelivered?.toLocaleString() || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Delivery Completion Rate
                  </p>
                  <p className={`text-2xl font-bold ${getScoreColor(metrics.deliveryCompletionRate)}`}>
                    {formatPercent(metrics.deliveryCompletionRate || 0)}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    FICO Score
                  </p>
                  <p className="text-xl font-semibold">
                    {metrics.ficoScore || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Delivery Success Behaviors
                  </p>
                  <p className="text-xl font-semibold">
                    {metrics.deliverySuccessBehaviors || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Safety Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Safety Metrics</CardTitle>
              <CardDescription>Events per 100 trips</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Seatbelt Off</span>
                  <Badge variant={metrics.seatbeltOffRate === 0 ? 'default' : 'destructive'}>
                    {formatRate(metrics.seatbeltOffRate || 0)}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Speeding Events</span>
                  <Badge variant={metrics.speedingEventRate === 0 ? 'default' : 'destructive'}>
                    {formatRate(metrics.speedingEventRate || 0)}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Distractions</span>
                  <Badge variant={metrics.distractionsRate <= 0.5 ? 'default' : 'destructive'}>
                    {formatRate(metrics.distractionsRate || 0)}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Following Distance</span>
                  <Badge variant={metrics.followingDistanceRate === 0 ? 'default' : 'destructive'}>
                    {formatRate(metrics.followingDistanceRate || 0)}
                  </Badge>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Signal Violations</span>
                <Badge variant={metrics.signalViolationsRate === 0 ? 'default' : 'destructive'}>
                  {formatRate(metrics.signalViolationsRate || 0)}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Customer Feedback */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Feedback</CardTitle>
              <CardDescription>Delivery quality and customer satisfaction</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    CDF DPMO
                  </p>
                  <p className="text-xl font-semibold">
                    {metrics.cdfDpmo || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Customer Escalations
                  </p>
                  <p className="text-xl font-semibold">
                    {metrics.customerEscalationDefect || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* POD Quality */}
          <Card>
            <CardHeader>
              <CardTitle>Photo-on-Delivery (POD) Quality</CardTitle>
              <CardDescription>POD performance and quality metrics</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    POD Acceptance Rate
                  </p>
                  <p className={`text-2xl font-bold ${getScoreColor(metrics.podAcceptanceRate)}`}>
                    {formatPercent(metrics.podAcceptanceRate || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    POD Quality Score
                  </p>
                  <p className={`text-2xl font-bold ${getScoreColor(metrics.podQualityScore)}`}>
                    {formatPercent(metrics.podQualityScore || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Rejects
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    {metrics.podRejects || 0}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-medium text-muted-foreground">Opportunities</p>
                  <p className="text-lg font-semibold">{metrics.podOpportunities || 0}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Success</p>
                  <p className="text-lg font-semibold text-green-600">{metrics.podSuccess || 0}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Bypass</p>
                  <p className="text-lg font-semibold">{metrics.podBypass || 0}</p>
                </div>
              </div>

              {/* POD Rejects Breakdown */}
              {metrics.podRejectsBreakdown && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-semibold mb-3">Reject Breakdown</p>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Blurry Photo</span>
                        <span className="font-medium">{metrics.podRejectsBreakdown.blurryPhoto || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Human In Picture</span>
                        <span className="font-medium">{metrics.podRejectsBreakdown.humanInPicture || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">No Package Detected</span>
                        <span className="font-medium">{metrics.podRejectsBreakdown.noPackageDetected || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Package In Car</span>
                        <span className="font-medium">{metrics.podRejectsBreakdown.packageInCar || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Package In Hand</span>
                        <span className="font-medium">{metrics.podRejectsBreakdown.packageInHand || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Not Clearly Visible</span>
                        <span className="font-medium">{metrics.podRejectsBreakdown.packageNotClearlyVisible || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Too Close</span>
                        <span className="font-medium">{metrics.podRejectsBreakdown.packageTooClose || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Too Dark</span>
                        <span className="font-medium">{metrics.podRejectsBreakdown.photoTooDark || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Other</span>
                        <span className="font-medium">{metrics.podRejectsBreakdown.other || 0}</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
