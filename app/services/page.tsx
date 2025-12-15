'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { FaMicrochip, FaCube, FaCode } from 'react-icons/fa'

const Masonry = dynamic(() => import('../components/Masonry'), {
  ssr: false,
  loading: () => null
})

interface ServiceRequest {
  service: string
  name: string
  email: string
  budget: string
  description: string
}

const SERVICES = [
  {
    id: 'iot',
    title: 'IoT Projects',
    icon: FaMicrochip,
    color: 'blood-red',
    description: 'Custom IoT solutions from embedded systems to smart devices',
    examples: [
      { name: 'Smart Home Automation', tech: 'ESP32, Arduino, MQTT' },
      { name: 'Drone Control Systems', tech: 'Pixhawk, Raspberry Pi' },
      { name: 'Industrial Monitoring', tech: 'Sensors, Cloud Integration' },
    ],
    pricing: [
      { tier: 'Basic', price: '$500-$1,500', desc: 'Simple IoT device with basic connectivity' },
      { tier: 'Standard', price: '$1,500-$5,000', desc: 'Multi-sensor system with cloud dashboard' },
      { tier: 'Enterprise', price: '$5,000+', desc: 'Full-scale IoT infrastructure with analytics' },
    ]
  },
  {
    id: '3d-printing',
    title: '3D Printing',
    icon: FaCube,
    color: 'gold',
    description: 'Professional 3D printing services for prototypes and custom parts',
    examples: [
      { name: 'Rapid Prototyping', tech: 'PLA, PETG, ABS' },
      { name: 'Custom Enclosures', tech: 'Multi-material printing' },
      { name: 'Functional Parts', tech: 'High-precision printing' },
    ],
    pricing: [
      { tier: 'Small Parts', price: '$10-$50', desc: 'Up to 100cm³, standard materials' },
      { tier: 'Medium Projects', price: '$50-$200', desc: 'Up to 500cm³, multiple parts' },
      { tier: 'Large/Complex', price: '$200+', desc: 'Large prints, special materials, post-processing' },
    ]
  },
  {
    id: 'web-app',
    title: 'Web & App Development',
    icon: FaCode,
    color: 'gold',
    description: 'Full-stack web and mobile applications with modern tech stacks',
    examples: [
      { name: 'AI-Powered Web Apps', tech: 'React, Next.js, OpenAI' },
      { name: 'Blockchain DApps', tech: 'Solidity, Ethereum, Web3' },
      { name: 'Real-time Dashboards', tech: 'Node.js, WebSockets, MongoDB' },
    ],
    pricing: [
      { tier: 'MVP/Landing', price: '$1,000-$3,000', desc: 'Basic website or MVP application' },
      { tier: 'Full Application', price: '$3,000-$10,000', desc: 'Complete web/mobile app with backend' },
      { tier: 'Enterprise', price: '$10,000+', desc: 'Complex systems, integrations, scalability' },
    ]
  },
]

export default function ServicesPage() {
  const [activeService, setActiveService] = useState<string | null>(null)
  const [formData, setFormData] = useState<ServiceRequest>({
    service: '',
    name: '',
    email: '',
    budget: '',
    description: ''
  })
  const [showForm, setShowForm] = useState(false)

  const handleRequestClick = (serviceId: string, serviceTitle: string) => {
    setActiveService(serviceId)
    setFormData({ ...formData, service: serviceTitle })
    setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Service request:', formData)
    alert('Request submitted! I\'ll get back to you soon.')
    setShowForm(false)
    setFormData({ service: '', name: '', email: '', budget: '', description: '' })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Mock images - replace with actual Supabase bucket URLs
  const printing3DImages = [
    { id: '1', img: '/assets/3d-prints/print1.jpg', height: 400 },
    { id: '2', img: '/assets/3d-prints/print2.jpg', height: 450 },
    { id: '3', img: '/assets/3d-prints/print3.jpg', height: 380 },
    { id: '4', img: '/assets/3d-prints/print4.jpg', height: 420 },
    { id: '5', img: '/assets/3d-prints/print5.jpg', height: 460 },
    { id: '6', img: '/assets/3d-prints/print6.jpg', height: 390 },
  ]

  return (
    <main className="min-h-screen bg-dark-bg relative overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-dark-bg via-dark-bg to-gray-900 opacity-50" />
      
      <div className="relative z-10 container mx-auto px-6 py-24">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl text-white mb-4">
            Services
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Transforming ideas into reality with cutting-edge technology
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {SERVICES.map((service) => {
            const Icon = service.icon
            return (
              <div
                key={service.id}
                className="glass-card p-8 rounded-2xl hover:scale-105 transition-transform duration-300"
              >
                <div className="flex items-center justify-center mb-6">
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-br from-${service.color}/20 to-${service.color}/5 flex items-center justify-center`}>
                    <Icon className={`text-4xl text-${service.color}`} />
                  </div>
                </div>
                
                <h2 className="text-2xl text-white text-center mb-4">
                  {service.title}
                </h2>
                
                <p className="text-gray-400 text-center mb-6">
                  {service.description}
                </p>

                {/* Example Projects */}
                <div className="mb-6">
                  <h3 className="text-sm text-gray-500 uppercase tracking-wider mb-3">Example Projects</h3>
                  <ul className="space-y-2">
                    {service.examples.map((example, idx) => (
                      <li key={idx} className="text-sm">
                        <div className="text-white font-medium">{example.name}</div>
                        <div className="text-gray-500 text-xs">{example.tech}</div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pricing */}
                <div className="mb-6">
                  <h3 className="text-sm text-gray-500 uppercase tracking-wider mb-3">Pricing</h3>
                  <ul className="space-y-3">
                    {service.pricing.map((price, idx) => (
                      <li key={idx} className="border-l-2 border-gold/30 pl-3">
                        <div className="flex justify-between items-start">
                          <span className="text-white font-medium text-sm">{price.tier}</span>
                          <span className="text-gold text-sm">{price.price}</span>
                        </div>
                        <p className="text-gray-500 text-xs mt-1">{price.desc}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleRequestClick(service.id, service.title)}
                  className={`w-full glass-button bg-gradient-to-r from-${service.color}/20 to-${service.color}/10 border-${service.color} text-white font-semibold py-3 rounded-lg hover:from-${service.color}/40 hover:to-${service.color}/20 transition-all`}
                >
                  Request Quote
                </button>
              </div>
            )
          })}
        </div>

        {/* My Works Gallery */}
        <div className="mb-20">
          <h2 className="text-3xl text-center text-white mb-8">My Works</h2>
          <p className="text-center text-gray-400 mb-12">Recent projects and portfolio pieces</p>
          
          <div className="max-w-6xl mx-auto">
            <Masonry
              items={printing3DImages}
              ease="power3.out"
              duration={0.6}
              stagger={0.08}
              animateFrom="bottom"
              scaleOnHover={true}
              hoverScale={1.05}
              blurToFocus={true}
            />
          </div>
        </div>

        {/* Request Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="glass-card max-w-2xl w-full p-8 rounded-2xl relative">
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
              
              <h2 className="text-2xl text-white mb-6">
                Request {formData.service}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="glass-input w-full"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="glass-input w-full"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Budget Range</label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    required
                    className="glass-input w-full"
                  >
                    <option value="">Select budget range</option>
                    <option value="Under $500">Under $500</option>
                    <option value="$500-$1,500">$500-$1,500</option>
                    <option value="$1,500-$5,000">$1,500-$5,000</option>
                    <option value="$5,000-$10,000">$5,000-$10,000</option>
                    <option value="$10,000+">$10,000+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Project Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="glass-input w-full resize-none"
                    placeholder="Tell me about your project requirements..."
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 glass-button border-gray-500 text-gray-300 py-3 rounded-lg hover:border-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 glass-button bg-gradient-to-r from-gold/20 to-blood-red/20 border-gold text-white font-semibold py-3 rounded-lg hover:from-gold/40 hover:to-blood-red/40"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
