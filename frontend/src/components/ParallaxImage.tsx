import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxImageProps {
  src: string;
  alt: string;
  speed?: number;
  className?: string;
}

/**
 * 패럴랙스 효과가 적용된 이미지 컴포넌트
 * 스크롤 시 배경 이미지가 느리게 움직이는 효과
 */
const ParallaxImage: React.FC<ParallaxImageProps> = ({
  src,
  alt,
  speed = 0.5,
  className = '',
}) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 1000 * speed]);

  return (
    <motion.div
      style={{ y }}
      className={`overflow-hidden ${className}`}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
      />
    </motion.div>
  );
};

export default ParallaxImage;
