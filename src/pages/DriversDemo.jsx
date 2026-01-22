import { useState, useEffect } from 'react'
import DriverTable from '../components/DriverTable'

export default function DriversDemo() {
  const [driversData, setDriversData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Load the merged drivers data
    // For demo purposes, you can either:
    // 1. Fetch from an API endpoint
    // 2. Import the JSON file directly (if it's in the public folder)
    // 3. Use the hardcoded data below

    // For now, let's fetch from the lambda output file
    // In production, this would be an API call
    const loadDriverData = async () => {
      try {
        // You'll need to copy merged_drivers.json to frontend/public/
        // Or import it directly if using Vite
        const response = await fetch('/merged_drivers.json')
        if (!response.ok) {
          throw new Error('Failed to load driver data')
        }
        const data = await response.json()
        setDriversData(data.drivers)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    loadDriverData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading drivers...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold">Error</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Driver Scorecards</h1>
        <p className="text-muted-foreground mt-2">
          View performance metrics for all drivers. Click "Preview" to see detailed scorecard.
        </p>
      </div>

      {driversData && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm font-medium text-blue-900">
            Total Drivers: <span className="font-bold">{Object.keys(driversData).length}</span>
          </p>
        </div>
      )}

      <DriverTable drivers={driversData} />
    </div>
  )
}
