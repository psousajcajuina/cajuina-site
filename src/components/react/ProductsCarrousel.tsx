import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import type { ProductItem } from '@/types';

interface Props {
  products: ProductItem[];
}

export default function ProductCarousel({ products }: Props) {
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(
    null
  );
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  const handleProductClick = (product: ProductItem) => {
    setSelectedProduct(product);
    // Pause autoplay when a product is selected
    if (swiperInstance?.autoplay) {
      swiperInstance.autoplay.stop();
    }
  };

  const handleProductHover = (product: ProductItem) => {
    setSelectedProduct(product);
  };

  const handleMouseLeave = () => {
    // Resume autoplay when mouse leaves
    if (swiperInstance?.autoplay) {
      swiperInstance.autoplay.start();
    }
  };

  return (
    <div className="flex w-full flex-col items-center justify-evenly overflow-hidden">
      <h4 className="text-caju-heading-primary mb-6 uppercase">Nossos Produtos</h4>

      <div className="w-full">
        <Swiper
          modules={[Autoplay, FreeMode]}
          spaceBetween={12}
          slidesPerView="auto"
          loop={true}
          speed={3000}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
          }}
          freeMode={{
            enabled: true,
            momentum: false,
          }}
          onSwiper={setSwiperInstance}
          className="product-carousel"
          onMouseLeave={handleMouseLeave}
        >
          {products.map((product, index) => (
            <SwiperSlide
              key={`${product.id}-${index}`}
              style={{ width: 'auto' }}
              className="flex items-end"
            >
              <div
                className="product-item relative cursor-pointer transition-transform hover:scale-110"
                style={{
                  width: `${product.sizes.width}px`,
                  height: `${product.sizes.height}px`,
                }}
                onClick={() => handleProductClick(product)}
                onMouseEnter={() => handleProductHover(product)}
              >
                <img
                  src={product.normal.src}
                  width={product.sizes.width}
                  height={product.sizes.height}
                  alt={product.alt || 'produto'}
                  className="absolute inset-0 h-full w-full object-contain transition-opacity duration-500"
                />
                <img
                  src={product.hover.src}
                  width={product.sizes.width}
                  height={product.sizes.height}
                  alt={product.alt || "produto"}
                  className="pointer-events-none absolute inset-0 h-full w-full object-contain opacity-0 transition-opacity duration-500"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Product Details - Hidden on mobile, visible on md and above */}
        {selectedProduct && (
          <div className="animate-in fade-in slide-in-from-bottom-4 mt-8 hidden px-4 duration-500 md:block">
            <div className="mx-auto max-w-6xl rounded-lg bg-white p-6 shadow-lg">
              <div className="grid items-start gap-8 md:grid-cols-2">
                {/* Product Image */}
                <div className="flex items-center justify-center">
                  <img
                    src={selectedProduct.hover || '/placeholder.svg'}
                    alt={selectedProduct.alt || 'Produto '}
                    className="max-h-96 object-contain"
                  />
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
