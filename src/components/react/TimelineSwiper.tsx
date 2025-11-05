import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import type { TimelineItem } from '@/types';
import { twMerge } from 'tailwind-merge';

interface Props {
  steps: TimelineItem[];
  className?: string;
}

export default function TimelineSwiper({ steps, className }: Props) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4">
      <Swiper
        modules={[Navigation, Autoplay, FreeMode]}
        slidesPerView={'auto'}
        autoplay={{
          delay: 5000,
          disableOnInteraction: true,
        }}
        grabCursor
        className={twMerge('z-150 h-full w-full overflow-hidden', className)}
      >
        {steps.map((item, index) => (
          <SwiperSlide
            className="h-full! max-w-[180px] min-w-[161px]!"
            key={item.title + index}
          >
            <div className="flex flex-col items-start">
              {/* bolinha e linha pontilhada */}
              <div className="relative mb-4 flex w-full items-center">
                <div
                  className={`h-4 w-4 rounded-full border-2 ${
                    index % 2 === 0
                      ? 'lg:border-caju-heading-primary border-yellow-400 bg-transparent'
                      : 'lg:bg-caju-heading-primary lg:border-caju-heading-primary border-yellow-400 bg-yellow-400'
                  }`}
                ></div>
                <div className="flex-1 border-t-[3px] border-dotted border-yellow-400 lg:border-black"></div>
              </div>

              {/* conteúdo */}
              <div className="mr-2">
                <h3 className="lg:text-caju-heading-primary mb-2 text-sm font-extrabold text-yellow-400 uppercase">
                  {item.title}
                </h3>
                <p className="font-inter text-caju-font text-left text-[9px]">
                  {item.content}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
