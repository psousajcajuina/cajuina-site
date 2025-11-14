import { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import type { ProductItem } from '@/types';
import ImageOptimized from '@/components/react/common/ImageOptimized';

interface Props {
  products: ProductItem[];
}

export default function ProductCarousel({ products }: Props) {
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(
    null
  );
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const handleProductClick = (product: ProductItem) => {
    setSelectedProduct(product);
    if (swiperInstance?.autoplay) {
      swiperInstance.autoplay.stop();
    }
  };

  // Scroll para o #productDetails quando selectedProduct mudar
  useEffect(() => {
    if (selectedProduct && detailsRef.current) {
      const elementPosition = detailsRef.current!.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - 140;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  }, [selectedProduct]);

  const handleCloseDetails = () => {
    setSelectedProduct(null);
    if (swiperInstance?.autoplay) {
      swiperInstance.autoplay.start();
    }
    // Volta scroll para o #products-section com offset de 70px
    if (sectionRef.current) {
      const elementPosition = sectionRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - 70;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div
      id="products-section"
      ref={sectionRef}
      className="flex w-full flex-col items-center gap-8 overflow-hidden py-8"
    >
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
          onSwiper={setSwiperInstance}
          className="w-full [&_.swiper-wrapper]:items-end"
        >
          {products.map((product) => (
            <SwiperSlide
              key={product.id}
              className="flex! items-end! justify-center!"
            >
              <div
                className="group relative cursor-pointer transition-transform duration-300 hover:scale-105"
                onClick={() => handleProductClick(product)}
              >
                <ImageOptimized
                  src={product.normal.src}
                  alt={product.details?.name || 'produto'}
                  loading="lazy"
                  className={`h-auto w-full min-w-[100px] max-h-[200px] object-contain transition-opacity duration-300 group-hover:opacity-0 md:min-w-[175px] md:max-h-[300px] ${
                    selectedProduct?.id === product.id ? 'opacity-0' : ''
                  }`}
                />
                <ImageOptimized
                  src={product.hover.src}
                  alt={product.details?.name || 'produto hover'}
                  loading="lazy"
                  className={`absolute inset-0 h-auto w-full min-w-[100px] max-h-[200px] object-contain opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:min-w-[175px] md:max-h-[300px] ${
                    selectedProduct?.id === product.id ? 'opacity-100' : ''
                  }`}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Botão de fechar discreto */}
        {/* {selectedProduct && (
          <button
            onClick={handleCloseDetails}
            className="absolute top-2 right-2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-gray-800/70 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-gray-900"
            aria-label="Fechar detalhes"
          >
            <span className="text-lg leading-none font-bold">×</span>
          </button>
        )} */}
      </div>

      {selectedProduct?.details && (
        <div
          id="productDetails"
          ref={detailsRef}
          className="animate-in fade-in slide-in-from-bottom-2 w-full duration-500"
        >
          <div className="relative mx-auto max-w-6xl p-4">
            {/* Botão fechar no painel */}
            <button
              onClick={handleCloseDetails}
              className="absolute top-1 right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-200 text-gray-600 transition-all duration-200 hover:bg-gray-300 hover:text-gray-800"
              aria-label="Fechar detalhes"
            >
              <span className="text-xl leading-none font-bold">×</span>
            </button>

            <div className="grid gap-10 rounded-lg shadow-lg md:grid-cols-2 md:p-6">
              {/* Imagem */}
              <div className="flex items-center justify-center">
                <ImageOptimized
                  src={selectedProduct.details.image.src}
                  alt={selectedProduct.details.name}
                  width={selectedProduct.details.image.width}
                  height={selectedProduct.details.image.height}
                  layout="responsive"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  loading="eager"
                  className="h-auto max-h-[850px] w-full bg-[#F7F7F7] object-contain object-center"
                />
              </div>
              {/* Detalhes */}
              <div className="flex h-auto flex-col items-center justify-start gap-6">
                <h6 className="text-caju-heading-primary text-xl font-normal uppercase lg:self-start lg:text-3xl">
                  {selectedProduct.details.name}
                </h6>
                <ImageOptimized
                  src={selectedProduct.details.nutritionalInfo.src}
                  alt="Informações Nutricionais"
                  width={selectedProduct.details.nutritionalInfo.width}
                  height={selectedProduct.details.nutritionalInfo.height}
                  layout="constrained"
                  sizes="(max-width: 1024px) 100vw, 512px"
                  loading="eager"
                  className="h-auto max-h-[400px] w-full max-w-lg rounded-lg bg-[#F7F7F7] object-contain"
                />
                <p className="font-inter text-justify font-normal lg:text-2xl">
                  {selectedProduct.ingredients ||
                    'Sem informação de ingredientes.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
