import { images } from "@/constants";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

const splashImages = [images.splash1, images.splash2, images.splash3, images.splash4];
const DURATION = 1100; // ms per splash (nhanh hơn)
const FINAL_HOLD = 900; // ms giữ ảnh cuối cùng (nhanh hơn)

interface SplashScreenProps {
  onFinish?: () => void;
}

const MobileSplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [index, setIndex] = useState(0);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    setOpacity(0);
    
    // Fade in animation
    const fadeInTimeout = setTimeout(() => {
      setOpacity(1);
    }, 50);

    if (index === 0) {
      timeout = setTimeout(() => setIndex(i => i + 1), DURATION);
    } else if (index < splashImages.length - 1) {
      timeout = setTimeout(() => setIndex(i => i + 1), DURATION);
    } else {
      timeout = setTimeout(() => onFinish && onFinish(), FINAL_HOLD);
    }
    
    return () => {
      clearTimeout(timeout);
      clearTimeout(fadeInTimeout);
    };
  }, [index, onFinish]);

  return (
    <div className="flex-1 bg-white flex items-center justify-center">
      <Image unoptimized
        src={splashImages[index]}
        alt={`Splash ${index + 1}`}
        width={314}
        height={600}
        quality={100}
        draggable={false}
        className="max-w-[314px] w-full h-full object-contain transition-opacity duration-400"
        style={{ opacity }}
      />
    </div>
  );
};

export default MobileSplashScreen;
