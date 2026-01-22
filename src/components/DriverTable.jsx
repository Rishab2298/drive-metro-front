import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'
import { Button } from './ui/button'
import { Eye } from 'lucide-react'
import ScorecardPreview from './ScorecardPreview'

export default function DriverTable({ drivers }) {
  const [selectedDriver, setSelectedDriver] = useState(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const handlePreview = (driver) => {
    setSelectedDriver(driver)
    setIsPreviewOpen(true)
  }

  const handleClosePreview = () => {
    setIsPreviewOpen(false)
    setSelectedDriver(null)
  }

  // Convert drivers object to array
  const driverArray = Object.values(drivers || {})

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Driver Name</TableHead>
              <TableHead>Employee ID</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {driverArray.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  No drivers found.
                </TableCell>
              </TableRow>
            ) : (
              driverArray.map((driver) => (
                <TableRow key={driver.employeeId}>
                  <TableCell className="font-medium">
                    {driver.firstName} {driver.lastName}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {driver.employeeId}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePreview(driver)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Preview
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedDriver && (
        <ScorecardPreview
          driver={selectedDriver}
          isOpen={isPreviewOpen}
          onClose={handleClosePreview}
        />
      )}
    </>
  )
}
