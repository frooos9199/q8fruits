import React, { useState, useEffect } from 'react';
import './MobileBanner.css';

interface BannerImage {
  url: string;
  alt: string;
}

const MobileBanner: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const bannerImages: BannerImage[] = [
    {
      url: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800',
      alt: 'فواكه طازجة'
    },
    {
      url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800',
      alt: 'خضروات طازجة'
    },
    {
      url: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800',
      alt: 'عروض خاصة'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === bannerImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 3500);

    return () => clearInterval(interval);
  }, [bannerImages.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="mobile-banner">
      <div className="banner-container">
        <div 
          className="banner-slides" 
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {bannerImages.map((image, index) => (
            <div key={index} className="banner-slide">
              <img src={image.url} alt={image.alt} />
              <div className="banner-overlay">
                <h2>{image.alt}</h2>
              </div>
            </div>
          ))}
        </div>
        
        <div className="banner-dots">
          {bannerImages.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`الانتقال إلى الصورة ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileBanner;
