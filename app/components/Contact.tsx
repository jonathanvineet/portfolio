'use client'

import { useState } from 'react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const [focusedField, setFocusedField] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission logic here
    console.log('Form submitted:', formData)
    alert('Message sent! (This is a demo)')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-dark-bg px-4 py-20">
      <h2 className="font-poppins text-gold mb-4 text-center">
        Get In Touch
      </h2>
      
      <p className="font-inter text-gray-400 text-center mb-12 max-w-xl">
        Have a project in mind or just want to chat? Drop me a message and I'll get back to you as soon as possible.
      </p>

      <div className="glass-card max-w-2xl w-full p-8 md:p-12 rounded-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <div>
            <label 
              htmlFor="name" 
              className="block font-inter text-sm text-gray-300 mb-2 font-medium"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField(null)}
              required
              className={`glass-input w-full ${focusedField === 'name' ? 'ring-2 ring-gold' : ''}`}
              placeholder="Your name"
            />
          </div>

          {/* Email Input */}
          <div>
            <label 
              htmlFor="email" 
              className="block font-inter text-sm text-gray-300 mb-2 font-medium"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              required
              className={`glass-input w-full ${focusedField === 'email' ? 'ring-2 ring-blood-red' : ''}`}
              placeholder="your.email@example.com"
            />
          </div>

          {/* Message Textarea */}
          <div>
            <label 
              htmlFor="message" 
              className="block font-inter text-sm text-gray-300 mb-2 font-medium"
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
              required
              rows={6}
              className={`glass-input w-full resize-none ${focusedField === 'message' ? 'ring-2 ring-gold' : ''}`}
              placeholder="Tell me about your project..."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full glass-button bg-gradient-to-r from-blood-red/20 to-gold/20 border-blood-red text-white font-poppins font-semibold text-lg hover:from-blood-red/40 hover:to-gold/40"
          >
            Send Message
          </button>
        </form>

        {/* Social Links or Additional Contact Info */}
        <div className="mt-8 pt-8 border-t border-white/10">
          <div className="flex justify-center space-x-6">
            <a 
              href="mailto:cvineetjonathan@gmail.com" 
              className="text-gray-400 hover:text-gold transition-colors duration-300 font-inter text-sm"
            >
              cvineetjonathan@gmail.com
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
