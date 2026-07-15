'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { Cpu, Box, Code2 } from 'lucide-react'

const Masonry = dynamic(() => import('../components/Masonry'), {
  ssr: false,
  loading: () => null
})

const SERVICES = [
  {
    id: 'iot',
    title: 'IoT & Embedded Systems',
    icon: Cpu,
    color: 'red',
    description: 'Custom IoT solutions from embedded systems to smart automation.',
    pricing: [
      ['Starter', '₹5,000 – ₹15,000'],
      ['Advanced', '₹15,000 – ₹50,000'],
      ['Enterprise', '₹50,000+'],
    ],
    whatsapp: 'https://wa.me/918122714827?text=Hi%20I%20want%20to%20know%20more%20about%20your%20IoT%20services',
    email: 'https://mail.google.com/mail/?view=cm&fs=1&to=cvineetjonathan@gmail.com&su=IoT%20Project%20Inquiry',
  },
  {
    id: '3d-printing',
    title: '3D Printing Services',
    icon: Box,
    color: 'yellow',
    description: 'Professional 3D printing for prototypes, collectibles, decor, cosplay and custom parts.',
    pricing: [
      ['Small Prints', '₹150 – ₹500'],
      ['Medium Projects', '₹500 – ₹2,000'],
      ['Large/Custom', '₹2,000+'],
    ],
    website: 'https://dreamforge3dprints.vercel.app/',
    whatsapp: 'https://wa.me/918122714827?text=Hi%20I%20want%20a%203D%20print',
    email: 'https://mail.google.com/mail/?view=cm&fs=1&to=cvineetjonathan@gmail.com&su=3D%20Printing%20Inquiry',
  },
  {
    id: 'web-app',
    title: 'Web & App Development',
    icon: Code2,
    color: 'yellow',
    description: 'Modern web apps, portfolios, dashboards and AI-powered platforms.',
    pricing: [
      ['Landing Pages', '₹8,000 – ₹20,000'],
      ['Full Stack Apps', '₹25,000 – ₹80,000'],
      ['Enterprise Systems', '₹1L+'],
    ],
    whatsapp: 'https://wa.me/918122714827?text=Hi%20I%20want%20a%20website',
    email: 'https://mail.google.com/mail/?view=cm&fs=1&to=cvineetjonathan@gmail.com&su=Web%20Development%20Inquiry',
  },
]


export default function ServicesPage() {
  const printing3DImages = [
    { id: '1', img: '/assets/3d-prints/print1.jpg', height: 400 },
    { id: '2', img: '/assets/3d-prints/print2.jpg', height: 450 },
    { id: '3', img: '/assets/3d-prints/print3.jpg', height: 380 },
    { id: '4', img: '/assets/3d-prints/print4.jpg', height: 420 },
    { id: '5', img: '/assets/3d-prints/print5.jpg', height: 460 },
    { id: '6', img: '/assets/3d-prints/print6.jpg', height: 390 },
  ]

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const iconVariants: Variants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: { duration: 0.5, type: 'spring', stiffness: 100 },
    },
    hover: {
      scale: 1.15,
      transition: { duration: 0.3 },
    },
  }

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { border: string; bg: string; text: string; glow: string }> = {
      red: {
        border: 'border-red-500',
        bg: 'bg-red-500',
        text: 'text-red-400',
        glow: 'hover:shadow-[0_0_25px_rgba(239,68,68,0.25)]',
      },
      yellow: {
        border: 'border-yellow-400',
        bg: 'bg-yellow-400',
        text: 'text-yellow-300',
        glow: 'hover:shadow-[0_0_25px_rgba(250,204,21,0.25)]',
      },
    }
    return colorMap[color] || colorMap.yellow
  }

  return (
    <main className="min-h-screen bg-black relative overflow-x-hidden">
      {/* Enhanced background with moving gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-slate-900 to-black opacity-60" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(250,204,21,0.05),rgba(0,0,0,0))]" />

      <div className="relative z-10 container mx-auto px-4 md:px-6 py-16 md:py-24">
        {/* Header */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
            Services
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Transforming ideas into reality with cutting-edge technology
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16 md:mb-20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {SERVICES.map((service) => {
            const Icon = service.icon
            const colors = getColorClasses(service.color)

            return (
              <motion.div
                key={service.id}
                variants={cardVariants}
                whileHover={{ y: -8 }}
                className="group relative"
              >
                {/* Animated background glow */}
                <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl ${colors.glow}`} />

                {/* Card */}
                <div className="relative bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 h-full flex flex-col hover:border-white/20 transition-all duration-300">
                  {/* Icon with animation */}
                  <motion.div
                    className="flex items-center justify-center mb-6"
                    variants={iconVariants}
                    whileHover="hover"
                  >
                    <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-${service.color}-500/20 to-${service.color}-500/5 flex items-center justify-center border border-${service.color}-500/30 group-hover:border-${service.color}-500/60 transition-all duration-300`}>
                      <Icon className={`w-8 h-8 md:w-10 md:h-10 ${colors.text}`} strokeWidth={1.5} />
                    </div>
                  </motion.div>

                  {/* Title */}
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-3 text-center">
                    {service.title}
                  </h2>

                  {/* Description */}
                  <p className="text-gray-400 text-center text-sm md:text-base mb-6 leading-relaxed flex-grow">
                    {service.description}
                  </p>

                  {/* Pricing */}
                  <div className="mb-8 space-y-3">
                    <h3 className="text-xs md:text-sm text-gray-500 uppercase tracking-wider font-semibold">
                      Pricing
                    </h3>
                    <div className="space-y-2">
                      {service.pricing.map((price, idx) => (
                        <div key={idx} className="flex justify-between items-center py-2 px-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-300">
                          <span className="text-white font-medium text-xs md:text-sm">
                            {price[0]}
                          </span>
                          <span className={`${colors.text} font-semibold text-xs md:text-sm`}>
                            {price[1]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col gap-3 mt-auto">
                    <a
                      href={service.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-3 text-center text-xs md:text-sm font-medium tracking-wide transition-all duration-300 text-white hover:bg-yellow-500/20 hover:border-yellow-500/40 ${colors.glow}`}
                    >
                      WhatsApp Inquiry
                    </a>

                    <a
                      href={service.email}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-xs md:text-sm font-medium tracking-wide transition-all duration-300 text-white hover:bg-white/10 hover:border-white/20"
                    >
                      Email Inquiry
                    </a>

                    {service.website && (
                      <a
                        href={service.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full rounded-xl border border-yellow-400/20 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 px-4 py-3 text-center text-xs md:text-sm font-medium tracking-wide transition-all duration-300 text-white hover:scale-[1.02] hover:border-yellow-400/40 hover:shadow-[0_0_30px_rgba(255,180,0,0.35)]"
                      >
                        Visit DreamForge →
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* My Works Gallery */}
        <motion.div
          className="mb-16 md:mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl text-center text-white mb-4 font-bold">
            My Works
          </h2>
          <p className="text-center text-gray-400 mb-12 text-sm md:text-base">
            Recent projects and portfolio pieces
          </p>

          <div className="max-w-6xl mx-auto">
            <Masonry items={printing3DImages} scaleOnHover hoverScale={1.05} />
          </div>
        </motion.div>
      </div>
    </main>
  )
}
