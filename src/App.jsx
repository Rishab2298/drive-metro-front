import React from 'react'

import { RouterProvider } from 'react-router-dom'
import { router } from './routes/routes'
import { Toaster } from '@/components/ui/sonner'
import { SubscriptionProvider } from '@/contexts/SubscriptionContext'
import { TutorialProvider } from '@/contexts/TutorialContext'

const App = () => {
  return (
    <TutorialProvider>
      <SubscriptionProvider>
        <RouterProvider router={router} />
        <Toaster position="bottom-right" />
      </SubscriptionProvider>
    </TutorialProvider>
  )
}

export default App