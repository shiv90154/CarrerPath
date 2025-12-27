import React, { useEffect, useRef, useState } from "react";

interface Slide {
  image: string;
}

const slides: Slide[] = [
  { image: "/banner1.jpeg" },
  { image: "/banner2.jpeg" },
  { image: "/banner3.jpeg" },
  { image: "/banner4.jpeg" },
  { image: "/banner5.jpeg" },
  { image: "/banner6.jpeg" },
];

const Hero: React.FC = () => {
  const [current, setCurrent] = useState<number>(0);
  const intervalRef = useRef<number | null>(null);

  const startSlider = () => {
    intervalRef.current = window.setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
  };

  const stopSlider = () => {
    if (intervalRef.current) window.clearInterval(intervalRef.current);
  };

  useEffect(() => {
    startSlider();
    return stopSlider;
  }, []);

  return (
    <section className="w-full bg-[#0B1F33]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 min-h-[60vh]">

        {/* LEFT CONTENT */}
        <div className="md:col-span-3 flex flex-col justify-center px-6 md:px-10 py-12 text-white">
          <h1 className="font-[Poppins] text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight">
            A Trusted Institute for <br />
            <span className="text-[#D4AF37]">
              Competitive Exam Excellence
            </span>
          </h1>

          <p className="font-[Inter] text-[#E5E7EB] mt-6 max-w-xl leading-relaxed">
            Career Pathway delivers structured preparation, expert mentoring,
            and result-oriented strategies for UPSC, HPAS, SSC, Banking, and
            other competitive examinations.
          </p>

          <ul className="mt-6 space-y-2 font-[Inter] text-sm text-[#E5E7EB]">
            <li>✔ Experienced & exam-oriented faculty</li>
            <li>✔ Structured test series with evaluation</li>
            <li>✔ Offline | Online | Hybrid learning modes</li>
          </ul>

      
        </div>

        {/* RIGHT SLIDER */}
        <div
          className="relative md:col-span-2 overflow-hidden bg-black"
          onMouseEnter={stopSlider}
          onMouseLeave={startSlider}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${index === current
                ? "opacity-100 scale-100 z-10"
                : "opacity-0 scale-105"
                }`}
            >
              <img
                src={slide.image}
                alt={`Hero Slide ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />

              {/* Overlays */}
              <div className="absolute inset-0 bg-[#0B1F33]/20" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
            </div>
          ))}

          {/* DOT INDICATORS */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-3 z-20">
            {slides.map((_, index) => (
              <button
                key={index}
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => setCurrent(index)}
                className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${index === current
                  ? "bg-[#D4AF37] scale-125"
                  : "bg-white/50 hover:bg-white"
                  }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
