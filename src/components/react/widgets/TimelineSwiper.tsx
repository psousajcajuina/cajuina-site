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
        rewind
        className={twMerge('z-150 h-full w-full overflow-hidden', className)}
      >
        {steps.map((item, index) => (
          <SwiperSlide
            className="h-full! max-w-[180px] min-w-[161px]! lg:max-w-[550px]"
            key={item.title + index}
          >
            <div className="flex flex-col items-start">
              {/* bolinha e linha pontilhada */}
              <div className="relative mb-4 flex w-full items-center">
                <div
                  className={`size-4 rounded-full border-2 lg:size-6 ${
                    index % 2 === 0
                      ? 'lg:bg-caju-heading-yellow border-yellow-400 bg-transparent'
                      : 'lg:bg-caju-heading-primary border-caju-heading-yellow bg-caju-heading-yellow'
                  }`}
                ></div>
                <div className="border-caju-heading-yellow flex-1 border-t-[3px] border-dotted lg:border-t-8 lg:border-black"></div>
              </div>

              {/* conteúdo */}
              <div className="mr-2">
                <h3 className="lg:text-caju-heading-primary text-caju-heading-yellow mb-2 max-w-[400px] text-sm font-extrabold uppercase lg:text-4xl">
                  {item.title}
                </h3>
                <p className="font-inter lg:text-caju-font text-left text-[9px] text-white lg:text-[24px]">
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
