import { useState } from 'react'

import { Navbar } from '@/pages/marketing/Navbar'
import { Hero } from '@/pages/marketing/Hero'
import { FeaturesSection } from '@/pages/marketing/FeaturesSection'
import { HowItWorks } from '@/pages/marketing/HowItWorks'
import { PricingSection } from '@/pages/marketing/PricingSection'
import { Footer } from '@/pages/marketing/Footer'
import { GetStartedModal } from '@/pages/marketing/GetStartedModal'
import type { ClientPlan } from '@/types'

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false)
  const [plan, setPlan] = useState<ClientPlan>('free')

  const openModal = (selectedPlan: ClientPlan = 'free') => {
    setPlan(selectedPlan)
    setModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-base-bg">
      <Navbar onGetStarted={() => openModal('free')} />
      <Hero onGetStarted={() => openModal('free')} />
      <FeaturesSection />
      <HowItWorks />
      <PricingSection onGetStarted={openModal} />
      <Footer />

      <GetStartedModal open={modalOpen} onClose={() => setModalOpen(false)} plan={plan} />
    </div>
  )
}
