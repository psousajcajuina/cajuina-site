import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

import { EffectCoverflow, Pagination } from 'swiper/modules';

const items = Array.from({ length: 10 }).map((_, i) => ({
  url: `https://swiperjs.com/demos/images/nature-${i + 1}.jpg`,
}));

export default function AboutPhotoGallery() {
  return (
    <div className="mt-5 mb-5 px-2">
      <Swiper
        modules={[Pagination]}
        spaceBetween={10}
        grabCursor={true}
        slidesPerView={3}
      >
        {items.map((item, index) => (
          <SwiperSlide className='size-[135px]!' key={index}>
            <img src={item.url} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
