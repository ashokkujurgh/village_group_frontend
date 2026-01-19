'use client';

import Header from "../component/header";
import { useState } from 'react';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    'https://via.placeholder.com/800x400?text=Slide+1',
    'https://via.placeholder.com/800x400?text=Slide+2',
    'https://via.placeholder.com/800x400?text=Slide+3',
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div>
      <Header />
      <div className="relative w-full  mx-auto mt-8">
       </div>
    </div>
  );
}