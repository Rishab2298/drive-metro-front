# Driver Table & Scorecard Preview Demo

## What Was Created

### Components

1. **DriverTable.jsx** (`src/components/DriverTable.jsx`)
   - Displays all drivers in a clean table format
   - Shows driver name and employee ID
   - "Preview" button for each driver

2. **ScorecardPreview.jsx** (`src/components/ScorecardPreview.jsx`)
   - Modal dialog showing complete driver scorecard
   - Organized into sections:
     - **Delivery Performance**: Packages delivered, DCR, FICO score, success behaviors
     - **Safety Metrics**: Seatbelt, speeding, distractions, following distance, signal violations
     - **Customer Feedback**: CDF DPMO, customer escalations
     - **POD Quality**: Acceptance rate, quality score, opportunities, success, bypass, rejects
     - **POD Rejects Breakdown**: 9 different reject categories
   - Color-coded metrics (green = good, yellow = warning, red = needs improvement)

3. **DriversDemo.jsx** (`src/pages/DriversDemo.jsx`)
   - Demo page that loads and displays the driver data
   - Shows total driver count
   - Handles loading and error states

### Data

- **merged_drivers.json** copied to `public/` folder
- Contains merged data from both DSP Scorecard and POD Details PDFs
- All 84 drivers with complete metrics

## How to Use

### View the Demo

The frontend is already running at: **http://localhost:5174/**

Open your browser and navigate to that URL to see:
- Table with all 84 drivers
- Click "Preview" on any driver to see their complete scorecard

### Features

**Table View:**
- Driver name (First Last)
- Employee ID (monospace font for readability)
- Preview button with eye icon

**Scorecard Preview:**
- Click anywhere outside the modal to close
- Scroll through all metrics sections
- Color-coded performance indicators:
  - **Green**: Excellent performance (DCR ≥ 99%, safety violations = 0)
  - **Yellow**: Good performance (DCR 95-99%)
  - **Red**: Needs improvement (DCR < 95%, safety violations > 0)

### Example Drivers to Check

1. **Adam LeMaster** (A3AHESB408LBV7)
   - 709 packages delivered
   - 99.7% DCR
   - 97.99% POD quality score
   - 10 POD rejects

2. **Alexander Roloff** (A3MO9ESFYULSCE)
   - 271 packages delivered
   - 99.3% DCR
   - 100% POD quality score (perfect!)

3. **Asia Henderson** (A1QK2TUA35MQUJ)
   - 891 packages delivered
   - 100% DCR
   - 100% POD quality score (perfect!)

## Component Usage in Your App

To use these components in other parts of your app:

```jsx
import DriverTable from './components/DriverTable'

// In your component
<DriverTable drivers={driversData} />
```

Where `driversData` is an object with employee IDs as keys:

```javascript
{
  "A3AHESB408LBV7": {
    "employeeId": "A3AHESB408LBV7",
    "firstName": "Adam",
    "lastName": "LeMaster",
    "metrics": { ... }
  },
  // ... more drivers
}
```

## Customization

### Change Color Thresholds

Edit `ScorecardPreview.jsx` and modify the `getScoreColor` function:

```javascript
const getScoreColor = (value, type = 'rate') => {
  if (type === 'rate') {
    if (value >= 99) return 'text-green-600'  // Change threshold
    if (value >= 95) return 'text-yellow-600'
    return 'text-red-600'
  }
  // ... more types
}
```

### Add More Metrics

1. Update the scorecard preview to add new Card sections
2. Extract metrics from `driver.metrics` object
3. Follow the existing pattern for display

### Styling

All components use Tailwind CSS and shadcn/ui components. Modify classes to match your design system.

## Production Integration

For production, replace the JSON file loading with an API call:

```javascript
// In DriversDemo.jsx
const response = await fetch('/api/drivers/scorecards')
const data = await response.json()
setDriversData(data.drivers)
```

## Dependencies Used

- **shadcn/ui components**: Table, Dialog, Card, Badge, Separator, Button
- **lucide-react**: Eye icon
- **Tailwind CSS**: All styling

All dependencies are already installed!

## Screenshots

### Table View
- Clean, modern table layout
- Monospace employee IDs for easy scanning
- Blue info banner with driver count

### Scorecard Preview
- Large modal with scrollable content
- Four main sections with cards
- Detailed POD rejects breakdown
- Color-coded badges for safety metrics
- Professional typography and spacing

## Next Steps

1. ✅ Table and scorecard preview working
2. Add search/filter functionality to table
3. Add sorting by different metrics
4. Add export to PDF functionality for scorecards
5. Add print view optimization
6. Integrate with backend API
7. Add authentication (Clerk)
8. Add bulk operations (select multiple drivers)

Enjoy exploring your driver scorecards! 🚗📊
