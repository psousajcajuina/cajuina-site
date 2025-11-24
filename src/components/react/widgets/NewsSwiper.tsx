import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { Navigation, Autoplay } from 'swiper/modules';
import ImageOptimized from '@/components/react/common/ImageOptimized';
import { useState } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';
import type { News } from '@/types';

interface NewsSwiperProps {
  news: Partial<News>[];
  arrowNext: string;
  arrowPrev: string;
}

export default function NewsSwiper({
  news,
  arrowNext,
  arrowPrev,
}: NewsSwiperProps) {
  if (!news || news.length === 0) return null;
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const isMobile = useIsMobile();

  const handlePause = () => {
    if (swiperInstance?.autoplay) {
      swiperInstance.autoplay.pause();
    }
  };

  const handleResume = () => {
    if (swiperInstance?.autoplay) {
      swiperInstance.autoplay.resume();
    }
  };

  return (
    <div
      className="relative mt-6 w-full md:px-12! lg:px-0"
      onMouseEnter={handlePause}
      onMouseLeave={handleResume}
    >
      <Swiper
        onSwiper={setSwiperInstance}
        modules={[Navigation, Autoplay]}
        slidesPerView={2}
        spaceBetween={20}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        navigation={{
          nextEl: '.news-next-btn',
          prevEl: '.news-prev-btn',
        }}
        breakpoints={{
          320: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 25,
          },
        }}
        className="mx-auto h-fit w-full max-w-[350px] pb-4 md:max-h-[520px] md:max-w-[700px] lg:max-w-[1350px]"
      >
        {news.map((post) => (
          <SwiperSlide
            onMouseOut={isMobile ? handleResume : () => {}}
            onClick={isMobile ? handlePause : () => {}}
            key={post.id}
          >
            {post.image && (
              <a className="cursor-pointer" href={post.permalink}>
                <ImageOptimized
                  src={post.image}
                  alt={post.title!}
                  width={350}
                  height={280}
                  layout="responsive"
                  aspectRatio="16/9"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  loading="lazy"
                  className="mb-3 h-[116px] w-full rounded-lg object-cover md:h-[280px]"
                />
              </a>
            )}
            <div className="flex max-h-fit flex-col text-left">
              <h5 className="text-caju-heading-primary mb-2 line-clamp-2 px-1 text-base md:text-lg">
                {post.title}
              </h5>

              <p className="font-inter mb-3 line-clamp-3 max-h-24 min-h-24 grow px-1 text-sm">
                {post.excerpt || post.content}
              </p>

              <a
                href={post.permalink}
                className="mx-1 inline-block h-fit w-fit rounded bg-green-600 px-4 py-1.5 text-sm font-medium text-white transition-all duration-300 hover:bg-green-700"
              >
                Leia Mais
              </a>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Buttons */}
      <button
        className="news-prev-btn absolute top-1/2 left-0 -translate-y-1/2 md:left-2"
        aria-label="Anterior"
      >
        <ImageOptimized
          src={arrowPrev}
          alt="Notícia Anterior"
          width={40}
          height={40}
          layout="fixed"
          loading="lazy"
          className="size-7! transition-transform duration-300 hover:scale-110 md:size-10"
        />
      </button>
      <button
        className="news-next-btn absolute top-1/2 right-0 -translate-y-1/2 md:right-2"
        aria-label="Próximo"
      >
        <ImageOptimized
          src={arrowNext}
          alt="Próxima Notícia"
          width={40}
          height={40}
          layout="fixed"
          loading="lazy"
          className="size-7! transition-transform duration-300 hover:scale-110 md:size-10"
        />
      </button>
    </div>
  );
}
