import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxTextProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

/**
 * 패럴랙스 효과가 적용된 텍스트 컴포넌트
 * 스크롤 시 텍스트가 부드럽게 움직이는 효과
 */
const ParallaxText: React.FC<ParallaxTextProps> = ({
  children,
  speed = 0.3,
  className = '',
}) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, -1000 * speed]);
  const opacity = useTransform(scrollY, [0, 300, 600], [1, 0.8, 0.3]);

  return (
    <motion.div
      style={{ y, opacity }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ParallaxText;
