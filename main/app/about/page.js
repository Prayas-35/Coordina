"use client";

import React from 'react';

function Landing() {
  const teamMembers = [
    { name: 'Prayas Pal', role: 'Team Lead', imgSrc: 'Prayas.jpg' },
    { name: 'Swikriti Mukherjee', imgSrc: 'Swikriti.jpg' },
    { name: 'Kaniska Mitra', imgSrc: 'Kaniska.jpg' },
    { name: 'Sudarshan Chaudhuri', imgSrc: 'Sudarshan.jpeg' },
    { name: 'Swajan Khasnobis',  imgSrc: 'Swajan.jpg' },
    { name: 'Sabittwa Banerjee',  imgSrc: 'Sabittwa.jpg' },
  ];

  return (
    <div className="bg-background min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-foreground mb-8">About Our Team</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        {teamMembers.map((member, index) => (
          <div key={index} className="bg-foreground rounded-lg shadow-lg p-6 flex flex-col items-center">
            <img 
              src={member.imgSrc} 
              alt={member.name} 
              className="w-32 h-32 object-cover rounded-full mb-4"
            />
            <h2 className="text-xl font-semibold text-background">{member.name}</h2>
            <p className="text-background">{member.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Landing;