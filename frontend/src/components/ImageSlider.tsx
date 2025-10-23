import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination, Navigation } from 'swiper/modules';
import { motion } from 'framer-motion';

// Swiper 스타일 import
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface ImageSliderProps {
  images: {
    url: string;
    title?: string;
    description?: string;
  }[];
  autoplay?: boolean;
  delay?: number;
  effect?: 'slide' | 'fade';
}

/**
 * 동적 이미지 슬라이더 컴포넌트
 * - 자동 재생 가능
 * - 페이드 효과 지원
 * - 크래프톤 스타일의 풀스크린 슬라이더
 */
const ImageSlider: React.FC<ImageSliderProps> = ({
  images,
  autoplay = true,
  delay = 5000,
  effect = 'fade',
}) => {
  return (
    <div className="w-full h-screen relative">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination, Navigation]}
        effect={effect}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={
          autoplay
            ? {
                delay,
                disableOnInteraction: false,
              }
            : false
        }
        pagination={{
          clickable: true,
        }}
        navigation={true}
        loop={true}
        className="h-full w-full"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full">
              {/* 배경 이미지 */}
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${image.url})`,
                }}
              >
                {/* 오버레이 */}
                <div className="absolute inset-0 bg-black bg-opacity-40" />
              </div>

              {/* 텍스트 콘텐츠 */}
              {(image.title || image.description) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 px-4">
                  {image.title && (
                    <motion.h2
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="text-5xl md:text-7xl font-bold mb-6 text-center"
                    >
                      {image.title}
                    </motion.h2>
                  )}
                  {image.description && (
                    <motion.p
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      className="text-xl md:text-2xl text-center max-w-3xl"
                    >
                      {image.description}
                    </motion.p>
                  )}
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 커스텀 스타일 */}
      <style>{`
        .swiper-pagination-bullet {
          background: white;
          opacity: 0.5;
          width: 12px;
          height: 12px;
        }
        .swiper-pagination-bullet-active {
          opacity: 1;
          background: white;
        }
        .swiper-button-next,
        .swiper-button-prev {
          color: white;
        }
      `}</style>
    </div>
  );
};

export default ImageSlider;
