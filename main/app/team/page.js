"use client";

import React from 'react';
import Header from '@/components/functions/Header';

function Landing() {
  const teamMembers = [
    { name: 'Sabittwa Banerjee', role: '', imgSrc: 'Sabittwa.jpg' },
    { name: 'Prayas Pal', role: '(Team Lead)', imgSrc: 'Prayas.jpg' },
    { name: 'Swikriti Mukherjee', role: '', imgSrc: 'Swikriti.jpg' },
    { name: 'Sudarshan Chaudhuri', role: '', imgSrc: 'Sudarshan.jpeg' },
    { name: 'Kaniska Mitra', role: '', imgSrc: 'Kaniska.jpg' },
    { name: 'Swajan Khasnobis', role: '', imgSrc: 'Swajan.jpg' },
  ];

  return (
    <>
      <Header />

      <div className="bg-background mt-[72.8px] flex flex-col items-center">
        <div className="text-4xl font-bold mb-1 pt-4 relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 py-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl">Our Team</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-transparent rounded-lg shadow-lg p-6 flex flex-col items-center border-4 border-border">
              <img
                src={member.imgSrc}
                alt={member.name}
                className="w-32 h-32 object-cover rounded-full mb-4 border-4 border-border"
              />
              <h2 className="text-xl font-semibold text-primary">{member.name}</h2>
              <p className="text-chart-2 pt-1">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Landing;
