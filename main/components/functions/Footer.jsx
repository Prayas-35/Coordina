"use client";

import React from 'react'
import Link from "next/link"
import { FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-transparent text-foreground py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">CitySync</h3>
            <p className="text-sm text-muted-foreground">Transforming India's cities for a smarter tomorrow.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm hover:underline">About Us</Link></li>
              <li><Link href="/services" className="text-sm hover:underline">Our Services</Link></li>
              <li><Link href="/projects" className="text-sm hover:underline">Projects</Link></li>
              <li><Link href="/contact" className="text-sm hover:underline">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link href="/blog" className="text-sm hover:underline">Blog</Link></li>
              <li><Link href="/case-studies" className="text-sm hover:underline">Case Studies</Link></li>
              <li><Link href="/faq" className="text-sm hover:underline">FAQ</Link></li>
              <li><Link href="/privacy" className="text-sm hover:underline">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary">
                <FaTwitter size={24} />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="https://linkedin.com/company/" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary">
                <FaLinkedin size={24} />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary">
                <FaGithub size={24} />
                <span className="sr-only">GitHub</span>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} CitySync. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}