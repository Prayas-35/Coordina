'use client';

import { useState } from 'react'
import { ChevronDownIcon } from "lucide-react"

export function Faq() {
    const [activeIndex, setActiveIndex] = useState(null)

    const toggleFAQ = (index: any) => {
        setActiveIndex(activeIndex === index ? null : index)
    }

    const faqData = [
        {
            question: "What is Coordina?",
            answer: "Coordina is a comprehensive urban management platform designed to transform India's cities for a smarter tomorrow. It offers tools for project management, resource allocation, conflict resolution, and interdepartmental collaboration."
        },
        {
            question: "How does Coordina help in urban planning?",
            answer: "Coordina provides a centralized dashboard for all city projects, real-time updates, and analytics. It helps in efficient resource management, conflict detection, and facilitates seamless communication between different departments involved in urban planning."
        },
        {
            question: "Is Coordina suitable for all city sizes?",
            answer: "Yes, Coordina is designed to be scalable and can be adapted for cities of all sizes. Whether you're managing a small town or a large metropolis, Coordina's features can be tailored to meet your specific urban management needs."
        },
        {
            question: "How does Coordina ensure data security?",
            answer: "Coordina employs state-of-the-art security measures, including end-to-end encryption, regular security audits, and compliance with data protection regulations. We also integrate blockchain technology for enhanced transparency and security in certain operations."
        },
        {
            question: "Can Coordina integrate with existing city management systems?",
            answer: "Yes, Coordina is designed with interoperability in mind. It can integrate with a wide range of existing systems and databases, ensuring a smooth transition and allowing cities to leverage their current infrastructure investments."
        }
    ]

    return (
        <>
            <div className="pt-20 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <h1 className="text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500">
                        Frequently Asked Questions
                    </h1>
                    <div className="space-y-4">
                        {faqData.map((faq, index) => (
                            <div key={index} className="mb-4">
                                <div
                                    onClick={() => toggleFAQ(index)}
                                    className={`w-full text-left p-4 rounded-lg transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-opacity-80 shadow-md cursor-pointer`}
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold">{faq.question}</span>
                                        <ChevronDownIcon
                                            className={`w-5 h-5 transition-transform duration-200 ${activeIndex === index ? 'transform rotate-180' : ''}`}
                                        />
                                    </div>
                                    {activeIndex === index && (
                                        <div className="mt-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                                            {faq.answer}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}
