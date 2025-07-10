'use client'

import React from 'react'
import Link from 'next/link'
import { Linkedin, Github } from 'lucide-react'

const footerLinks = [
  {
    title: 'Products',
    links: ['Work Management', 'CRM', 'Dev', 'Service'],
  },
]

const socialIcons = [
  { icon: <Github />, href: 'https://github.com' },
  { icon: <Linkedin />, href: 'https://linkedin.com' },
]

const Footer = () => {
  return (
    <footer className="bg-white text-gray-700 mt-20 pb-12">
      <div className="max-w-screen-xl mx-auto px-6 py-16">
        {/* Top Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-12 mb-12">
          {footerLinks.map((section, idx) => (
            <div key={idx}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2 text-sm">
                {section.links.map((item, i) => {
                  const label = typeof item === 'string' ? item : item.label
                  const href = typeof item === 'string' ? '#' : item.href
                  const isBold = typeof item !== 'string'

                  return (
                    <li key={i}>
                      <Link
                        href={href}
                        className={`hover:underline ${isBold ? 'font-semibold text-black' : ''}`}
                      >
                        {label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="flex flex-col items-center justify-center gap-6 text-sm text-center pt-8">
          <div className="flex gap-5 text-gray-500">
            {socialIcons.map((item, i) => (
              <a
                key={i}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-black transition"
              >
                {item.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
