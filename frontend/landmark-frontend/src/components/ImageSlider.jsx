// src/components/ImageSlider.jsx
import { useState, useEffect, useRef } from "react";
import "./ImageSlider.css";

export default function ImageSlider({ images = [], alt, height = "200px", autoPlay }) {
  const [index, setIndex] = useState(0);
  const [transition, setTransition] = useState(true);
  const sliderRef = useRef();

  const sliderImages = [...images, images[0]]; // clone first image

  useEffect(() => {
    if (!autoPlay || images.length <= 1) return;

    const interval = setInterval(() => {
      setIndex((prev) => prev + 1);
    }, 2000);

    return () => clearInterval(interval);
  }, [autoPlay, images.length]);

  useEffect(() => {
    if (index === images.length) {
      setTimeout(() => {
        setTransition(false);
        setIndex(0);
      }, 800);
    } else {
      setTransition(true);
    }
  }, [index, images.length]);

  return (
    <div className="slider" style={{ height }}>
      <div
        ref={sliderRef}
        className="slider-track"
        style={{
          transform: `translateX(-${index * 100}%)`,
          transition: transition ? "transform 0.8s ease-in-out" : "none",
        }}
      >
        {sliderImages.map((img, i) => (
          <img key={i} src={img} alt={alt} />
        ))}
      </div>
    </div>
  );
}