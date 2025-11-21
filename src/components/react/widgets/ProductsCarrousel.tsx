import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import type { ProductItem } from '@/types';
import ImageOptimized from '@/components/react/common/ImageOptimized';

interface Props {
  products: ProductItem[];
}

export default function ProductCarousel({ products }: Props) {
  return (
    <div className="flex w-full flex-col items-center gap-8 overflow-hidden py-8">
      <h4 className="text-caju-heading-primary uppercase">Nossos Produtos</h4>

      <div className="relative w-full">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={30}
          slidesPerView={3}
          rewind={true}
          loop={true}
          speed={800}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            320: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 5,
              spaceBetween: 35,
            },
            1280: {
              slidesPerView: 6,
              spaceBetween: 40,
            },
          }}
          className="w-full [&_.swiper-wrapper]:items-end"
        >
          {products.map((product) => (
            <SwiperSlide
              key={product.id}
              className="flex! items-end! justify-center!"
            >
              <a
                href={`/produtos/${product.slug}`}
                className="group relative block cursor-pointer transition-transform duration-300 hover:scale-105"
              >
                <ImageOptimized
                  src={product.normal.src}
                  alt={product.details?.name || 'produto'}
                  loading="lazy"
                  className="h-auto w-full min-w-[100px] max-h-[200px] object-contain transition-opacity duration-300 group-hover:opacity-0 md:min-w-[175px] md:max-h-[300px]"
                />
                <ImageOptimized
                  src={product.hover?.src || product.normal.src}
                  alt={product.details?.name || 'produto hover'}
                  loading="lazy"
                  className="absolute inset-0 h-auto w-full min-w-[100px] max-h-[200px] object-contain opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:min-w-[175px] md:max-h-[300px]"
                />
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
