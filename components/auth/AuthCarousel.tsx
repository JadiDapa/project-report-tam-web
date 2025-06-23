"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function AuthCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    "https://plus.unsplash.com/premium_photo-1682310144714-cb77b1e6d64a?q=80&w=2112&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1494797262163-102fae527c62?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1549633030-89d0743bad01?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];

  const texts = [
    "Capture What You’re Thinking",
    "Open Your Mind Endlessly",
    "Show Emotions You Never Knew",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <aside className="absolute -z-50 h-full w-full overflow-hidden p-4 opacity-40 lg:relative lg:z-0 lg:block lg:opacity-100">
      <div className="relative h-full w-full overflow-hidden rounded-3xl">
        {/* Logo */}
        <div className="bg-tertiary/50 absolute right-0 top-0 z-50 flex h-20 w-52 items-center justify-center rounded-bl-3xl p-4">
          <div className="mx-auto flex max-w-fit items-center gap-3 rounded-full border bg-secondary px-3 py-1">
            <div className="grid size-8 place-items-center rounded-full bg-primary">
              <p className="font-bold text-secondary">LG</p>
            </div>

            <p className="font-semibold">PSYCHOLOGY</p>
          </div>
        </div>

        <div className="absolute inset-0 h-full w-full bg-primary/30 object-cover" />

        {/* Image Carousel */}
        {images.map((src, index) => (
          <Image
            key={index}
            src={src || "/placeholder.svg"}
            alt={`Slide ${index + 1}`}
            fill
            className={`absolute inset-0 -z-10 object-cover transition-opacity duration-1000 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
            priority={index === 0}
          />
        ))}

        {/* Navigation Dots */}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-4">
          {images.map((_, index) => (
            <button
              key={index}
              className={`h-1 w-20 rounded-full transition-colors ${
                index === currentIndex ? "bg-white" : "bg-white/50"
              }`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Text Carousel */}
        <div className="absolute bottom-32 left-[28%] text-center">
          {texts.map((text, index) => (
            <p
              key={index}
              className={`absolute w-80 text-3xl text-slate-100 transition-all duration-1000 ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              {text}
            </p>
          ))}
        </div>
      </div>
    </aside>
  );
}
