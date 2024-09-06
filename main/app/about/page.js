"use client";

import { FocusCards } from "@/components/ui/focus-cards";

export function FocusCardsDemo() {
  const localCards = [
    {
      title: "Prayas Pal",
      src: "/Kaniska.jpg",
    },
    {
      title: "Kaniska Mitra",
      src: "/Kaniska.jpg",
    },
    {
      title: "Swikriti Mukherjee",
      src: "/Swikriti.jpg",
    },
    {
      title: "Sudarshan Chaudhuri",
      src: "/Sudarshan.jpeg",
    },
    {
      title: "Swajan Khasnobis",
      src: "/Kaniska.jpg",
    },
    {
      title: "Sabittwa Banerjee",
      src: "/Sabittwa.jpg",
    },
  ];


  return (
    <>
      <h3 className="flex justify-between items-center p-6 border-b border-border">About Us</h3>
      <div className="cards-wrapper">
        <FocusCards cards={localCards} />
      </div>

      <style jsx>{`
        .about-me-heading {
          font-size: 2.5rem;
          text-align: center;
          margin-bottom: 2rem;
          font-weight: bold;
          color: #333;
        }

        .cards-wrapper {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          margin-bottom: 3rem;
        }

        .cards-wrapper:hover :global(.card:not(:hover)) {
          filter: grayscale(100%);
        }

        .cards-wrapper :global(.card) {
          transition: filter 0.3s ease, transform 0.3s ease;
          margin: 10px;
        }

        .cards-wrapper :global(.card:hover) {
          transform: scale(1.05); /* Optional zoom on hover */
        }
      `}</style>
    </>
  );
}

export default FocusCardsDemo;
