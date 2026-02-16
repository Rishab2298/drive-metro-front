// Export guide content for each document type, organized by Cortex version
// Each guide contains 5-7 steps with placeholder images

export const EXPORT_GUIDES = {
  // Cortex 2.0 guides (full document set)
  "2": {
    "scorecard": {
      title: "How to Export DSP Scorecard",
      steps: [
        {
          stepNumber: 1,
          title: "Log in to Amazon Logistics",
          description: "Log in to your Amazon Logistics portal at logistics.amazon.com and click on the Performance tab on the menu above.",
          imagePath: "/ScreenshotsScorecard/1.png"
        },
        {
          stepNumber: 2,
          title: "Open Supplementary Reports",
          description: "Click on 'Performance' in the main navigation, then select 'Supplementary Reports' from the dropdown menu.",
          imagePath: "/ScreenshotsScorecard/2.png"
        },
        {
          stepNumber: 3,
          title: "Select the Week",
          description: "In the 'Supplementary Reports' section, use the date picker to select the week you want to export. Make sure the DSP Scorecard is available in that week, if not switch back to the previous week.",
          imagePath: "/ScreenshotsScorecard/3.png"
        },
        {
          stepNumber: 4,
          title: "Download & Verify",
          description: "Find the DSP Scorecard and click on it to download. Verify the filename matches the expected format: US_[DSP]_[Station]_Week[N]_[Year]_en_DSPScorecard.pdf",
          imagePath: "/ScreenshotsScorecard/4.png"
        }
      ]
    },
    "weekly-overview": {
      title: "How to Export Weekly Overview",
      steps: [
        {
          stepNumber: 1,
          title: "Log in to Amazon Logistics",
          description: "Log in to your Amazon Logistics portal at logistics.amazon.com and click on the Performance tab on the menu above.",
          imagePath: "/weekly overview/1.png"
        },
        {
          stepNumber: 2,
          title: "Open Performance Summary",
          description: "Click on 'Performance' in the main navigation, then select 'Performance Summary' from the dropdown menu.",
          imagePath: "/weekly overview/2.png"
        },
        {
          stepNumber: 3,
          title: "Select the Week",
          description: "In the 'Performance Summary' section, use the date picker to select the week you used for the scorecard.",
          imagePath: "/weekly overview/3.png"
        },
        {
          stepNumber: 4,
          title: "Download DA Weekly Overview",
          description: "Scroll down to DA Weekly Overview section, make sure you've selected 'Week', then click the download button at the top-right corner of the table. Verify the filename matches: DSP_Overview_Dashboard_[DSP]_[Station]_[Year]-W[Week].csv",
          imagePath: "/weekly overview/4.png"
        }
      ]
    },
    "trailing-six-week": {
      title: "How to Export 6-Week Trailing Report",
      steps: [
        {
          stepNumber: 1,
          title: "Log in to Amazon Logistics",
          description: "Log in to your Amazon Logistics portal at logistics.amazon.com and click on the Performance tab on the menu above.",
          imagePath: "/6week/1.png"
        },
        {
          stepNumber: 2,
          title: "Open Performance Summary",
          description: "Click on 'Performance' in the main navigation, then select 'Performance Summary' from the dropdown menu.",
          imagePath: "/6week/2.png"
        },
        {
          stepNumber: 3,
          title: "Select the Week",
          description: "In the 'Performance Summary' section, use the date picker to select the week you used for the scorecard.",
          imagePath: "/6week/3.png"
        },
        {
          stepNumber: 4,
          title: "Download Trailing 6-Week",
          description: "Scroll down to DA Weekly Overview section, make sure you've selected 'Trailing 6-Week', then click the download button at the top-right corner of the table. Verify the filename matches: DSP_Overview_Dashboard_Trailing_Six_Week_[DSP]_[Station]_[Year]-W[Week].csv",
          imagePath: "/6week/4.png"
        }
      ]
    },
    "negative-feedback": {
      title: "How to Export Customer Feedback Report",
      steps: [
        {
          stepNumber: 1,
          title: "Log in to Amazon Logistics",
          description: "Log in to your Amazon Logistics portal at logistics.amazon.com and click on the Performance tab on the menu above.",
          imagePath: "/CDNF/1.png"
        },
        {
          stepNumber: 2,
          title: "Open Quality Dashboard",
          description: "Click on 'Performance' in the main navigation, then select 'Quality Dashboard' from the dropdown menu.",
          imagePath: "/CDNF/2.png"
        },
        {
          stepNumber: 3,
          title: "Select the Week",
          description: "In the 'Quality Dashboard' page, use the date picker to select 'Week', and then select the week you used for the scorecard.",
          imagePath: "/CDNF/3.png"
        },
        {
          stepNumber: 4,
          title: "Open Negative Feedback Section",
          description: "Scroll down to Customer Delivery Feedback - Negative section, then click on the number inside that box to open the Customer Delivery Negative Feedback page.",
          imagePath: "/CDNF/4.png"
        },
        {
          stepNumber: 5,
          title: "Download & Verify",
          description: "In the 'Customer Delivery Negative Feedback' page, use the date picker to select week and the week you used for the scorecard. Then click the download button in the top-left corner of the table. Verify the filename matches: DSP_Customer_Delivery_Feedback_negative_[Station]_[Year]-W[Week].csv",
          imagePath: "/CDNF/5.png"
        }
      ]
    },
    "pod-quality": {
      title: "How to Export POD Quality Report",
      steps: [
        {
          stepNumber: 1,
          title: "Log in to Amazon Logistics",
          description: "Log in to your Amazon Logistics portal at logistics.amazon.com and click on the Performance tab on the menu above.",
          imagePath: "/POD/1.png"
        },
        {
          stepNumber: 2,
          title: "Open Supplementary Reports",
          description: "Click on 'Performance' in the main navigation, then select 'Supplementary Reports' from the dropdown menu.",
          imagePath: "/POD/2.png"
        },
        {
          stepNumber: 3,
          title: "Select the Week",
          description: "In the 'Supplementary Reports' section, use the date picker to select the week you used for your scorecard.",
          imagePath: "/POD/3.png"
        },
        {
          stepNumber: 4,
          title: "Download & Verify",
          description: "Find the POD Details file and click on it to download. Verify filename format: US-[DSP]-[Station]-Week[N]-[Year]NA-DA-POD-Details.pdf",
          imagePath: "/POD/4.png"
        }
      ]
    },
    "pps-daily": {
      title: "How to Export PPS Daily Report",
      steps: [
        {
          stepNumber: 1,
          title: "Log in to Amazon Logistics",
          description: "Log in to your Amazon Logistics portal at logistics.amazon.com and click on the Performance tab on the menu above.",
          imagePath: "/ppsReport/1.png"
        },
        {
          stepNumber: 2,
          title: "Open Supplementary Reports",
          description: "Click on 'Performance' in the main navigation, then select 'Supplementary Reports' from the dropdown menu.",
          imagePath: "/ppsReport/2.png"
        },
        {
          stepNumber: 3,
          title: "Select the Week",
          description: "In the 'Supplementary Reports' section, use the date picker to select the week you used for the scorecard.",
          imagePath: "/ppsReport/3.png"
        },
        {
          stepNumber: 4,
          title: "Open PPS Daily Report",
          description: "Find and click on PPS Daily Report.",
          imagePath: "/ppsReport/4.png"
        },
        {
          stepNumber: 5,
          title: "Access Export Menu",
          description: "On the 'PPS Daily Report' page, hover over the second section 'Daily PPS Report - DA Level'. On the extreme right, a small set of icons will appear - click on the last 3 dots icon.",
          imagePath: "/ppsReport/5.png"
        },
        {
          stepNumber: 6,
          title: "Export to CSV",
          description: "Clicking on the ':' icon will reveal a dropdown. Select 'Export to CSV'. Verify the downloaded file format: Daily_PPS_Report_-[Identifier].csv",
          imagePath: "/ppsReport/6.png"
        }
      ]
    },
    "dvic": {
      title: "How to Export DVIC Report",
      steps: [
        {
          stepNumber: 1,
          title: "Log in to Amazon Logistics",
          description: "Log in to your Amazon Logistics portal at logistics.amazon.com and click on the Performance tab on the menu above.",
          imagePath: "/DVIC/1.png"
        },
        {
          stepNumber: 2,
          title: "Open Supplementary Reports",
          description: "Click on 'Performance' in the main navigation, then select 'Supplementary Reports' from the dropdown menu.",
          imagePath: "/DVIC/2.png"
        },
        {
          stepNumber: 3,
          title: "Select the Week",
          description: "In the 'Supplementary Reports' section, use the date picker to select the week you used for the scorecard.",
          imagePath: "/DVIC/3.png"
        },
        {
          stepNumber: 4,
          title: "Download Latest DVIC Report",
          description: "Find and click on the most recent available DVIC Report. There may be multiple reports - select the latest one. Verify the filename format: US_[DSP]_[Station]_[Year]_week-[N]_[Date]_DVIC_Time_Last_7_Days.xlsx",
          imagePath: "/DVIC/4.png"
        }
      ]
    },
    "paw-print": {
      title: "How to Export Paw Print Compliance",
      steps: [
        {
          stepNumber: 1,
          title: "Open Paw Print Dashboard",
          description: "Click on the button below to open the Paw Print dashboard directly.",
          imagePath: "/pawPrint/1.png",
          showDashboardLink: true
        },
        {
          stepNumber: 2,
          title: "At-Stop Safety Insights Page",
          description: "You'll land on 'At-Stop Safety Insights Weekly Report' page.",
          imagePath: "/pawPrint/2.png"
        },
        {
          stepNumber: 3,
          title: "Find Notification Section",
          description: "Scroll down to 'Notification on Arrival for Addresses with Paw Prints (%)' section and hover over it. You'll see 3 icons on the top right corner of the table.",
          imagePath: "/pawPrint/3.png"
        },
        {
          stepNumber: 4,
          title: "Open Export Menu",
          description: "Click on the 3 dotted icon on the right and a dropdown will appear.",
          imagePath: "/pawPrint/4.png"
        },
        {
          stepNumber: 5,
          title: "Export to CSV",
          description: "On the dropdown, click 'Export to CSV'. Verify the downloaded file format: Notification_on_Arri_[Identifier].csv",
          imagePath: "/pawPrint/5.png"
        }
      ]
    },
    "safety-dashboard": {
      title: "How to Export Safety Dashboard",
      steps: [
        {
          stepNumber: 1,
          title: "Log in to Amazon Logistics",
          description: "Log in to your Amazon Logistics portal at logistics.amazon.com and click on the Performance tab on the menu above.",
          imagePath: "/safety/1.png"
        },
        {
          stepNumber: 2,
          title: "Open Safety Dashboard",
          description: "Click on 'Performance' in the main navigation, then select 'Safety Dashboard' from the dropdown menu.",
          imagePath: "/safety/2.png"
        },
        {
          stepNumber: 3,
          title: "Select Week View",
          description: "In the 'Safety Dashboard' page, use the week picker to select 'Week'.",
          imagePath: "/safety/3.png"
        },
        {
          stepNumber: 4,
          title: "Select the Week",
          description: "In the date picker, select the week you used for your scorecard.",
          imagePath: "/safety/4.png"
        },
        {
          stepNumber: 5,
          title: "Download & Verify",
          description: "Scroll down to find 'Metric event-level details' section. On the right side of the table, click the download icon to download the CSV file. Verify the filename format: Safety_Dashboard_[DSP]_[Station]_[Year]-W[Week].csv",
          imagePath: "/safety/5.png"
        }
      ]
    }
  },
  // Cortex 1.0 guides (limited document set - 4 types only)
  "1": {
    "scorecard": {
      title: "How to Export DSP Scorecard",
      steps: [
        {
          stepNumber: 1,
          title: "Log in to Amazon Logistics",
          description: "Log in to your Amazon Logistics portal at logistics.amazon.com and click on the Performance tab on the menu above.",
          imagePath: "/ScreenshotsScorecard/1.png"
        },
        {
          stepNumber: 2,
          title: "Open Supplementary Reports",
          description: "Click on 'Performance' in the main navigation, then select 'Supplementary Reports' from the dropdown menu.",
          imagePath: "/ScreenshotsScorecard/2.png"
        },
        {
          stepNumber: 3,
          title: "Select the Week",
          description: "In the 'Supplementary Reports' section, use the date picker to select the week you want to export. Make sure the DSP Scorecard is available in that week, if not switch back to the previous week.",
          imagePath: "/ScreenshotsScorecard/3.png"
        },
        {
          stepNumber: 4,
          title: "Download & Verify",
          description: "Find the DSP Scorecard and click on it to download. Verify the filename matches the expected format: US_[DSP]_[Station]_Week[N]_[Year]_en_DSPScorecard.pdf",
          imagePath: "/ScreenshotsScorecard/4.png"
        }
      ]
    },
    "weekly-overview": {
      title: "How to Export Weekly Overview",
      steps: [
        {
          stepNumber: 1,
          title: "Log in to Amazon Logistics",
          description: "Log in to your Amazon Logistics portal at logistics.amazon.com and click on the Performance tab on the menu above.",
          imagePath: "/weekly overview/1.png"
        },
        {
          stepNumber: 2,
          title: "Open Performance Summary",
          description: "Click on 'Performance' in the main navigation, then select 'Performance Summary' from the dropdown menu.",
          imagePath: "/weekly overview/2.png"
        },
        {
          stepNumber: 3,
          title: "Select the Week",
          description: "In the 'Performance Summary' section, use the date picker to select the week you used for the scorecard.",
          imagePath: "/weekly overview/3.png"
        },
        {
          stepNumber: 4,
          title: "Download DA Weekly Overview",
          description: "Scroll down to DA Weekly Overview section, make sure you've selected 'Week', then click the download button at the top-right corner of the table. Verify the filename matches: DSP_Overview_Dashboard_[DSP]_[Station]_[Year]-W[Week].csv",
          imagePath: "/weekly overview/4.png"
        }
      ]
    },
    "pod-quality": {
      title: "How to Export POD Quality Report",
      steps: [
        {
          stepNumber: 1,
          title: "Log in to Amazon Logistics",
          description: "Log in to your Amazon Logistics portal at logistics.amazon.com and click on the Performance tab on the menu above.",
          imagePath: "/POD/1.png"
        },
        {
          stepNumber: 2,
          title: "Open Supplementary Reports",
          description: "Click on 'Performance' in the main navigation, then select 'Supplementary Reports' from the dropdown menu.",
          imagePath: "/POD/2.png"
        },
        {
          stepNumber: 3,
          title: "Select the Week",
          description: "In the 'Supplementary Reports' section, use the date picker to select the week you used for your scorecard.",
          imagePath: "/POD/3.png"
        },
        {
          stepNumber: 4,
          title: "Download & Verify",
          description: "Find the POD Details file and click on it to download. Verify filename format: US-[DSP]-[Station]-Week[N]-[Year]NA-DA-POD-Details.pdf",
          imagePath: "/POD/4.png"
        }
      ]
    },
    "trailing-six-week": {
      title: "How to Export 6-Week Trailing Report",
      steps: [
        {
          stepNumber: 1,
          title: "Log in to Amazon Logistics",
          description: "Log in to your Amazon Logistics portal at logistics.amazon.com and click on the Performance tab on the menu above.",
          imagePath: "/6week/1.png"
        },
        {
          stepNumber: 2,
          title: "Open Performance Summary",
          description: "Click on 'Performance' in the main navigation, then select 'Performance Summary' from the dropdown menu.",
          imagePath: "/6week/2.png"
        },
        {
          stepNumber: 3,
          title: "Select the Week",
          description: "In the 'Performance Summary' section, use the date picker to select the week you used for the scorecard.",
          imagePath: "/6week/3.png"
        },
        {
          stepNumber: 4,
          title: "Download Trailing 6-Week",
          description: "Scroll down to DA Weekly Overview section, make sure you've selected 'Trailing 6-Week', then click the download button at the top-right corner of the table. Verify the filename matches: DSP_Overview_Dashboard_Trailing_Six_Week_[DSP]_[Station]_[Year]-W[Week].csv",
          imagePath: "/6week/4.png"
        }
      ]
    }
  }
};

// Helper function to get guide for a specific document and cortex version
export const getExportGuide = (docId, cortexVersion = "2") => {
  const versionGuides = EXPORT_GUIDES[cortexVersion] || EXPORT_GUIDES["2"];
  return versionGuides[docId] || null;
};
