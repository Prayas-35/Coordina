'use client'

import { useState, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoonIcon, SunIcon, ChevronDownIcon } from "lucide-react"
import Link from 'next/link'

const Header = ({ isDarkMode, toggleDarkMode }) => {
    return (
        <header className={`fixed w-full z-50 ${isDarkMode ? 'bg-black/30' : 'bg-white/60'} backdrop-blur-md shadow-md transition-colors duration-300`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <nav className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <Link href="/" passHref>
                            <img src={isDarkMode ? "Logo6.png" : "Logo6 dark.png"} className="h-5 w-5 sm:h-10 sm:w-10 mr-2" />
                        </Link>
                        <Link href="/" className={`text-lg sm:text-xl font-bold relative ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            CitySync
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link href="/" passHref>
                            <Button variant="ghost" className={isDarkMode ? 'text-white' : 'text-gray-700'}>
                                Home
                            </Button>
                        </Link>
                        <Link href="/contact" passHref>
                            <Button variant="ghost" className={isDarkMode ? 'text-white' : 'text-gray-700'}>
                                Contact
                            </Button>
                        </Link>
                        <Button variant="ghost" onClick={toggleDarkMode} className={isDarkMode ? 'text-white' : 'text-gray-700'}>
                            {isDarkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
                        </Button>
                    </div>
                </nav>
            </div>
        </header>
    )
}

const FAQItem = ({ question, answer, isDarkMode }) => {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <div
            className="mb-4"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div
                className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${isDarkMode
                    ? 'bg-gray-800 text-white hover:bg-opacity-80'
                    : 'bg-white text-gray-900 hover:bg-gray-50 shadow-md'
                    }`}
            >
                <div className="flex justify-between items-center">
                    <span className="font-semibold">{question}</span>
                    <ChevronDownIcon
                        className={`w-5 h-5 transition-transform duration-200 ${isHovered ? 'transform rotate-180' : ''}`}
                    />
                </div>
                {isHovered && (
                    <div className={`mt-2 p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'
                        }`}>
                        {answer}
                    </div>
                )}
            </div>
        </div>
    )
}

export default function Component() {
    const [isDarkMode, setIsDarkMode] = useState(false)

    useEffect(() => {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        setIsDarkMode(isDark)
    }, [])

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode)
    }

    const faqData = [
        {
            question: "What is CitySync?",
            answer: "CitySync is a comprehensive urban management platform designed to transform India's cities for a smarter tomorrow. It offers tools for project management, resource allocation, conflict resolution, and interdepartmental collaboration."
        },
        {
            question: "How does CitySync help in urban planning?",
            answer: "CitySync provides a centralized dashboard for all city projects, real-time updates, and analytics. It helps in efficient resource management, conflict detection, and facilitates seamless communication between different departments involved in urban planning."
        },
        {
            question: "Is CitySync suitable for all city sizes?",
            answer: "Yes, CitySync is designed to be scalable and can be adapted for cities of all sizes. Whether you're managing a small town or a large metropolis, CitySync's features can be tailored to meet your specific urban management needs."
        },
        {
            question: "How does CitySync ensure data security?",
            answer: "CitySync employs state-of-the-art security measures, including end-to-end encryption, regular security audits, and compliance with data protection regulations. We also integrate blockchain technology for enhanced transparency and security in certain operations."
        },
        {
            question: "Can CitySync integrate with existing city management systems?",
            answer: "Yes, CitySync is designed with interoperability in mind. It can integrate with a wide range of existing systems and databases, ensuring a smooth transition and allowing cities to leverage their current infrastructure investments."
        }
    ]

    return (
        <>
            <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
            <div className={`min-h-screen pt-20 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} transition-colors duration-300`}>
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <h1 className={`text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500`}>
                        Frequently Asked Questions
                    </h1>
                    <div className="space-y-4">
                        {faqData.map((faq, index) => (
                            <FAQItem key={index} question={faq.question} answer={faq.answer} isDarkMode={isDarkMode} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}