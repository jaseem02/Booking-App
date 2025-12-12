import React, { useEffect, useState } from "react";

const FALLBACK = "https://placehold.co/800x450?text=No+Image&font=roboto";

const RoomImageSlider = ({ images = [] }) => {
  const imgs = Array.isArray(images) ? images : [];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (imgs.length === 0) {
      setCurrentIndex(0);
    } else if (currentIndex >= imgs.length) {
      setCurrentIndex(imgs.length - 1);
    }
  }, [imgs, currentIndex]);

  const handlePrev = () => {
    if (imgs.length === 0) return;
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? imgs.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    if (imgs.length === 0) return;
    setCurrentIndex((prevIndex) =>
      prevIndex === imgs.length - 1 ? 0 : prevIndex + 1
    );
  };

  const currentImage = imgs?.[currentIndex]?.image || FALLBACK;
  const caption = imgs?.[currentIndex]?.caption || "";

  return (
    <div className="image-slider" style={{ display: "flex", alignItems: "center" }}>
      <button onClick={handlePrev} disabled={imgs.length <= 1} aria-label="Previous">
        &#10094;
      </button>

      <div style={{ width: 800, height: 450, display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden" }}>
        <img
          src={currentImage}
          alt={caption || "Room image"}
          className="slider-image"
          style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "cover" }}
          onError={(e) => {
            if (e?.target?.src !== FALLBACK) e.target.src = FALLBACK;
          }}
        />
      </div>

      <button onClick={handleNext} disabled={imgs.length <= 1} aria-label="Next">
        &#10095;
      </button>
    </div>
  );
};

export default RoomImageSlider;
