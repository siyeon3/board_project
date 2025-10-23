import { useEffect, useState } from 'react';

/**
 * 스크롤 위치를 추적하는 커스텀 훅
 * 크래프톤 스타일의 스크롤 기반 애니메이션을 위한 훅
 */
export const useScrollAnimation = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollY;
};

/**
 * 섹션별 배경색을 변경하는 커스텀 훅
 * 스크롤 위치에 따라 배경색이 부드럽게 전환됨
 */
export const useBackgroundColor = (sections: string[]) => {
  const [backgroundColor, setBackgroundColor] = useState(sections[0] || '#000000');
  const scrollY = useScrollAnimation();

  useEffect(() => {
    const windowHeight = window.innerHeight;
    const sectionIndex = Math.floor(scrollY / windowHeight);
    const newColor = sections[Math.min(sectionIndex, sections.length - 1)];

    if (newColor !== backgroundColor) {
      setBackgroundColor(newColor);
    }
  }, [scrollY, sections, backgroundColor]);

  return backgroundColor;
};
