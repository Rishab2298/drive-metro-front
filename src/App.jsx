import React from 'react'

import { RouterProvider } from 'react-router-dom'
import { router } from './routes/routes'
import { Toaster } from '@/components/ui/sonner'
import { SubscriptionProvider } from '@/contexts/SubscriptionContext'

const App = () => {
  return (
    <SubscriptionProvider>
      <RouterProvider router={router} />
      <Toaster position="bottom-right" />
    </SubscriptionProvider>
  )
}

export default App