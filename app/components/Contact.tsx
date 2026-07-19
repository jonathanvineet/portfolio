'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Mail, Phone, MapPin, AlertCircle, CheckCircle } from 'lucide-react'
import { FaGithub, FaLinkedin, FaXTwitter, FaWhatsapp, FaInstagram } from 'react-icons/fa6'
import { SiGmail } from 'react-icons/si'
import styles from '../../styles/Hero.module.css'

interface FormData {
  name: string
  email: string
  message: string
}

interface FormStatus {
  type: 'idle' | 'loading' | 'success' | 'error'
  message?: string
}

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  })

  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [formStatus, setFormStatus] = useState<FormStatus>({ type: 'idle' })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    let root = document.getElementById('hero-bg-portal')
    if (!root) {
      root = document.createElement('div')
      root.id = 'hero-bg-portal'
      document.body.appendChild(root)
    }
    return () => {
      const el = document.getElementById('hero-bg-portal')
      if (el && el.childElementCount === 0) el.remove()
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setFormStatus({
        type: 'error',
        message: 'Please fill in all fields'
      })
      return
    }

    if (formData.message.length < 10) {
      setFormStatus({
        type: 'error',
        message: 'Message must be at least 10 characters long'
      })
      return
    }

    setFormStatus({ type: 'loading' })

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setFormStatus({
          type: 'success',
          message: 'Message sent successfully! I\'ll get back to you soon.'
        })
        setFormData({ name: '', email: '', message: '' })
        
        // Reset success message after 5 seconds
        setTimeout(() => {
          setFormStatus({ type: 'idle' })
        }, 5000)
      } else {
        setFormStatus({
          type: 'error',
          message: data.error || 'Failed to send message. Please try again.'
        })
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setFormStatus({
        type: 'error',
        message: 'An error occurred. Please try again later.'
      })
    }
  }

  const portalRoot = typeof window !== 'undefined' ? document.getElementById('hero-bg-portal') : null

  const fixedBackgrounds = (
    <>
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className={styles.floatingGlow}></div>
        <div className={styles.floatingGlow}></div>
        <div className={styles.floatingGlow}></div>
        <div className={styles.floatingGlow}></div>
      </div>
    </>
  )

  return (
    <section
      className={styles.heroContainer + ' bg-dark-bg bg-fixed relative flex flex-col items-center justify-center px-4 py-20'}
      style={{
        backgroundAttachment: 'fixed',
        backgroundImage: `linear-gradient(rgba(10,10,12,0.6), rgba(10,10,12,0.6)), url(/assets/contact.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {mounted && portalRoot ? createPortal(fixedBackgrounds, portalRoot) : fixedBackgrounds}

      {/* Header */}
      <div className="text-center mb-16 relative" style={{ zIndex: 20 }}>
        <h1 className="text-blood-red mb-4 text-5xl md:text-6xl font-bold">
          Let's Connect
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Have a project in mind? Want to collaborate? Or just want to chat about tech? I'm always up for a conversation.
        </p>
        <div className="mt-6 flex items-center justify-center gap-2">
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-blood-red to-gold rounded-full"></div>
          <span className="text-sm text-gray-500">Reach Out</span>
          <div className="w-20 h-0.5 bg-gradient-to-r from-gold via-blood-red to-transparent rounded-full"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 w-full max-w-6xl relative" style={{ zIndex: 20 }}>
        {/* Contact Information - Left Side */}
        <div className="space-y-8">
          {/* Contact Details */}
          <div className="glass-card rounded-2xl p-8">
            <h2 className="text-2xl text-gold mb-6 font-bold">Contact Info</h2>
            
            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Email</h3>
                  <a 
                    href="mailto:cvineetjonathan@gmail.com" 
                    className="text-gray-400 hover:text-gold transition-colors"
                  >
                    cvineetjonathan@gmail.com
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Phone</h3>
                  <a 
                    href="tel:+918122714827" 
                    className="text-gray-400 hover:text-red-400 transition-colors"
                  >
                    +91 812 271 4827
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Based In</h3>
                  <p className="text-gray-400">
                    India
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="glass-card rounded-2xl p-8">
            <h2 className="text-2xl text-gold mb-6 font-bold">Follow Me</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <a
                href="https://github.com/jonathanvineet"
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-white/10 hover:border-gold/50 hover:bg-gold/5 transition-all duration-300 group"
              >
                <FaGithub className="w-8 h-8 text-gray-400 group-hover:text-gold transition-colors mb-2" />
                <span className="text-xs text-gray-400 group-hover:text-gold transition-colors">GitHub</span>
              </a>

              <a 
                href="https://linkedin.com/in/jonathanvineet" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-white/10 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all duration-300 group"
              >
                <FaLinkedin className="w-8 h-8 text-gray-400 group-hover:text-blue-400 transition-colors mb-2" />
                <span className="text-xs text-gray-400 group-hover:text-blue-400 transition-colors">LinkedIn</span>
              </a>

              <a 
                href="https://x.com/jonathan_vineet" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-white/10 hover:border-sky-500/50 hover:bg-sky-500/5 transition-all duration-300 group"
              >
                <FaXTwitter className="w-8 h-8 text-gray-400 group-hover:text-sky-400 transition-colors mb-2" />
                <span className="text-xs text-gray-400 group-hover:text-sky-400 transition-colors">X / Twitter</span>
              </a>

              <a
                href="https://www.instagram.com/jonathan_vineet/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-white/10 hover:border-pink-500/50 hover:bg-pink-500/5 transition-all duration-300 group"
              >
                <FaInstagram className="w-8 h-8 text-gray-400 group-hover:text-pink-400 transition-colors mb-2" />
                <span className="text-xs text-gray-400 group-hover:text-pink-400 transition-colors">Instagram</span>
              </a>
            </div>
          </div>
        </div>

        {/* Contact Form - Right Side */}
        <div className="glass-card rounded-2xl p-8 md:p-12 h-fit">
          <h2 className="text-2xl text-gold mb-8 font-bold">Send me a Message</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Status Messages */}
            {formStatus.type !== 'idle' && (
              <div className={`flex items-start gap-3 p-4 rounded-lg ${
                formStatus.type === 'success' 
                  ? 'bg-green-500/10 border border-green-500/30' 
                  : formStatus.type === 'error'
                  ? 'bg-red-500/10 border border-red-500/30'
                  : 'bg-blue-500/10 border border-blue-500/30'
              }`}>
                {formStatus.type === 'success' && (
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                )}
                {formStatus.type === 'error' && (
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                )}
                {formStatus.type === 'loading' && (
                  <div className="w-5 h-5 rounded-full border-2 border-blue-500/30 border-t-blue-400 animate-spin flex-shrink-0" />
                )}
                <p className={`text-sm ${
                  formStatus.type === 'success'
                    ? 'text-green-300'
                    : formStatus.type === 'error'
                    ? 'text-red-300'
                    : 'text-blue-300'
                }`}>
                  {formStatus.message}
                </p>
              </div>
            )}

            {/* Name Input */}
            <div>
              <label 
                htmlFor="name" 
                className="block text-sm text-gray-300 mb-2 font-medium"
              >
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                disabled={formStatus.type === 'loading'}
                required
                className={`glass-input w-full transition-all disabled:opacity-50 disabled:cursor-not-allowed ${focusedField === 'name' ? 'ring-2 ring-gold border-gold' : ''}`}
                placeholder="Your name"
              />
            </div>

            {/* Email Input */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm text-gray-300 mb-2 font-medium"
              >
                Your Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                disabled={formStatus.type === 'loading'}
                required
                className={`glass-input w-full transition-all disabled:opacity-50 disabled:cursor-not-allowed ${focusedField === 'email' ? 'ring-2 ring-gold border-gold' : ''}`}
                placeholder="your.email@example.com"
              />
            </div>

            {/* Message Textarea */}
            <div>
              <label 
                htmlFor="message" 
                className="block text-sm text-gray-300 mb-2 font-medium"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                onFocus={() => setFocusedField('message')}
                onBlur={() => setFocusedField(null)}
                disabled={formStatus.type === 'loading'}
                required
                rows={6}
                className={`glass-input w-full resize-none transition-all disabled:opacity-50 disabled:cursor-not-allowed ${focusedField === 'message' ? 'ring-2 ring-gold border-gold' : ''}`}
                placeholder="Tell me about your project or idea..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={formStatus.type === 'loading'}
              className="w-full glass-button bg-gradient-to-r from-blood-red/20 to-gold/20 border-blood-red text-white font-semibold text-lg hover:from-blood-red/40 hover:to-gold/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formStatus.type === 'loading' ? 'Sending...' : 'Send Message'}
            </button>
          </form>

          {/* Alternative Contact Methods */}
          <div className="mt-8 pt-8 border-t border-white/10">
            <p className="text-sm text-gray-400 mb-4">
              Or reach out directly via:
            </p>
            <div className="flex flex-col gap-2">
              <a
                href="https://wa.me/918122714827?text=Hi%20Vineet%2C%20I%20wanted%20to%20connect%20with%20you"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gold hover:text-gold/80 transition-colors"
              >
                <FaWhatsapp className="w-4 h-4" /> WhatsApp
              </a>
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=cvineetjonathan@gmail.com&su=Project%20Inquiry"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gold hover:text-gold/80 transition-colors"
              >
                <SiGmail className="w-4 h-4" /> Gmail
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
