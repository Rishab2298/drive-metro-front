import React from 'react'

const ExportGuideInfor = () => {
  return (
    <>
    Cortex 2.0 Export Guide
    <h1>Paw Print Compliance</h1>
    <span>Step 1 : Clcik on the Link.
        {/* add the respective paw prints amazon link over here inside a button, the paraameters must be exactly the same as it is in the main upload page */}
    </span>
    <img src="frontend/public/pawPrint/1.png" alt="Step 1" />
    <span>Step 2 : You'll land on 'At-Stop Safety Insights Weekly Report' page</span>
    <img src="frontend/public/pawPrint/2.png" alt="Step 2" />
    <span>Step 3 : Scroll Down to 'Notification on Arrival for Addresses with Paw Prints (%)' section and hover over it, and you'll 3 icons on the top right corner of table</span>
    <img src="frontend/public/pawPrint/3.png" alt="Step 3" />
    <span>Step 4 : Click on the 3 dotted icon on the right and a dropdown will appear</span>
        <img src="frontend/public/pawPrint/4.png" alt="Step 4 " />

    <span>Step 5 :On the dropdown Click on Export to csv. Verify the downlaoded files format be : Notification_on_Arri_1770998973314.csv</span>

    <img src="frontend/public/pawPrint/5.png" alt="Step 5" />
   
    </>
  )
}

export default ExportGuideInfor