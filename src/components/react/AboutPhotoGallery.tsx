import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

// import 'swiper/css';
// import 'swiper/css/effect-coverflow';
// import 'swiper/css/pagination';

import { Autoplay, FreeMode, Navigation } from 'swiper/modules';

const items = Array.from({ length: 10 }).map((_, i) => ({
  url: `https://swiperjs.com/demos/images/nature-${i + 1}.jpg`,
}));

export default function AboutPhotoGallery() {
  return (
    <div className="mx-auto mt-5 mb-5 w-full max-w-6xl px-2">
      <Swiper
        modules={[Navigation, Autoplay, FreeMode]}
        slidesPerView={'auto'}
        autoplay={{
          delay: 5000,
          disableOnInteraction: true,
        }}
        grabCursor
      >
        {items.map((item, index) => (
          <SwiperSlide className="size-[135px]!" key={item.url + index}>
            <img src={item.url} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
// export default function AboutPhotoGallery() {
//   console.log('AboutPhotoGallery CHAMADO!');

//   return (
//     <div
//       style={{
//         background: 'green',
//         color: 'white',
//         padding: '100px',
//         fontSize: '40px',
//         border: '5px solid red',
//       }}
//     >
//       🎉 COMPONENTE REACT FUNCIONANDO! 🎉
//     </div>
//   );
// }
