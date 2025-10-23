import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface ScrollSectionProps {
  children: React.ReactNode;
  backgroundColor?: string;
  textColor?: string;
  minHeight?: string;
  id?: string;
}

/**
 * 스크롤 애니메이션이 적용된 섹션 컴포넌트
 * - 화면에 보이면 페이드인 효과
 * - 섹션별로 다른 배경색 설정 가능
 */
const ScrollSection: React.FC<ScrollSectionProps> = ({
  children,
  backgroundColor = '#000000',
  textColor = '#FFFFFF',
  minHeight = '100vh',
  id,
}) => {
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: false,
  });

  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0 }}
      animate={{
        opacity: inView ? 1 : 0,
        backgroundColor: backgroundColor,
        color: textColor,
      }}
      transition={{
        duration: 0.8,
        ease: 'easeInOut',
      }}
      style={{
        minHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      {children}
    </motion.section>
  );
};

export default ScrollSection;
