import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import { Autoplay, FreeMode, Navigation } from 'swiper/modules';

const items = Array.from({ length: 10 }).map((_, i) => ({
  url: `https://swiperjs.com/demos/images/nature-${i + 1}.jpg`,
}));

export default function AboutPhotoGallery() {
  return (
    <div className="relative w-full overflow-hidden">
      <div className="-mx-[calc(100vw-100%)] my-5 w-screen">
        <Swiper
          modules={[Navigation, Autoplay, FreeMode]}
          slidesPerView={3}
          spaceBetween={12}
          autoplay={{
            delay: 1500,
            disableOnInteraction: true,
          }}
          grabCursor
        >
          {items.map((item, index) => (
            <SwiperSlide key={item.url + index}>
              <img
                className="size-[135px] rounded-[28px] object-cover"
                src={item.url}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
