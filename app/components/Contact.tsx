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

      <div className="glass-panel max-w-2xl w-full p-8 md:p-12 rounded-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <div>
            <label 
              htmlFor="name" 
              className="block font-inter text-sm text-gray-300 mb-2"
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
              className={`
                w-full px-4 py-3 bg-dark-panel border-2 rounded
                font-inter text-white
                transition-all duration-300
                focus:outline-none
                ${focusedField === 'name' 
                  ? 'border-gold shadow-[0_0_15px_rgba(240,192,0,0.5)]' 
                  : 'border-gray-700'
                }
              `}
              placeholder="Your name"
            />
          </div>

          {/* Email Input */}
          <div>
            <label 
              htmlFor="email" 
              className="block font-inter text-sm text-gray-300 mb-2"
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
              className={`
                w-full px-4 py-3 bg-dark-panel border-2 rounded
                font-inter text-white
                transition-all duration-300
                focus:outline-none
                ${focusedField === 'email' 
                  ? 'border-blood-red shadow-[0_0_15px_rgba(170,26,26,0.5)]' 
                  : 'border-gray-700'
                }
              `}
              placeholder="your.email@example.com"
            />
          </div>

          {/* Message Textarea */}
          <div>
            <label 
              htmlFor="message" 
              className="block font-inter text-sm text-gray-300 mb-2"
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
              className={`
                w-full px-4 py-3 bg-dark-panel border-2 rounded
                font-inter text-white resize-none
                transition-all duration-300
                focus:outline-none
                ${focusedField === 'message' 
                  ? 'border-gold shadow-[0_0_15px_rgba(240,192,0,0.5)]' 
                  : 'border-gray-700'
                }
              `}
              placeholder="Tell me about your project..."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="
              w-full py-4 px-8 
              bg-transparent border-2 border-blood-red
              text-blood-red font-poppins font-semibold text-lg
              rounded cursor-pointer
              transition-all duration-300
              hover:bg-blood-red hover:text-dark-bg
              hover:shadow-[0_0_25px_rgba(170,26,26,0.8)]
              hover:transform hover:-translate-y-1
              active:translate-y-0
            "
          >
            Send Message
          </button>
        </form>

        {/* Social Links or Additional Contact Info */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="flex justify-center space-x-6">
            <a 
              href="mailto:your.email@example.com" 
              className="text-gray-400 hover:text-gold transition-colors duration-300 font-inter text-sm"
            >
              your.email@example.com
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
