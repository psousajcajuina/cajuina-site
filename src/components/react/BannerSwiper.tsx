import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';

interface CTAButton {
  text: string;
  url: string;
  variant: 'primary' | 'secondary' | 'outline';
}

interface BannerData {
  title: string;
  subtitle?: string;
  description?: string;
  image: string;
  imageMobile?: string;
  cta?: CTAButton;
  textPosition: 'left' | 'center' | 'right';
  textAlign: 'top' | 'middle' | 'bottom';
  overlay: boolean;
}

interface BannerSwiperProps {
  banners: Array<{
    data: BannerData;
    id: string;
  }>;
}

const positionClasses: Record<BannerData['textPosition'], string> = {
  left: 'text-left items-start',
  center: 'text-center items-center',
  right: 'text-right items-end',
};

const alignClasses: Record<BannerData['textAlign'], string> = {
  top: 'justify-start pt-20',
  middle: 'justify-center',
  bottom: 'justify-end pb-20',
};

const ctaClasses: Record<CTAButton['variant'], string> = {
  primary: 'bg-white text-gray-900 hover:bg-gray-100',
  secondary: 'bg-blue-600 text-white hover:bg-blue-700',
  outline:
    'border-2 border-white text-white hover:bg-white hover:text-gray-900',
};

export default function BannerSwiper({ banners }: BannerSwiperProps) {
  if (!banners || banners.length === 0) return null;

  return (
    <>
      <style>{`
        .banner-swiper-wrapper {
          position: relative;
          width: 100%;
          height: 341px;
          overflow: hidden;
        }
        
        @media (min-width: 768px) {
          .banner-swiper-wrapper {
            height: 700px;
          }
        }
        
        .banner-swiper-wrapper .swiper {
          width: 100%;
          height: 100%;
        }
        
        .banner-swiper-wrapper .swiper-slide {
          width: 100%;
          height: 100%;
        }
        
        /* Bullets customization */
        .banner-swiper-wrapper .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: rgba(247, 164, 33, 0.6);
          opacity: 1;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }
        
        .banner-swiper-wrapper .swiper-pagination-bullet-active {
          width: 32px;
          border-radius: 6px;
          background: linear-gradient(135deg, #f7a421 0%, #ea5426 100%);
          box-shadow: 0 4px 12px rgba(234, 84, 38, 0.4);
        }
        
        .banner-swiper-wrapper .swiper-pagination-bullet:hover {
          background: rgba(247, 164, 33, 0.9);
          transform: scale(1.1);
        }
        
        .banner-swiper-wrapper .swiper-pagination {
          bottom: 0.25rem;
        }
      `}</style>

      <div className="banner-swiper-wrapper">
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          effect="fade"
          fadeEffect={{
            crossFade: true,
          }}
          speed={700}
          loop={banners.length > 1}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={
            banners.length > 1
              ? {
                  clickable: true,
                }
              : false
          }
        >
          {banners.map((banner, index) => {
            const {
              title,
              subtitle,
              description,
              image,
              imageMobile,
              cta,
              textPosition,
              textAlign,
              overlay,
            } = banner.data;

            return (
              <SwiperSlide key={banner.id}>
                <div className="relative size-full bg-gray-900">
                  {/* Background Image */}
                  <picture>
                    {imageMobile && (
                      <source media="(max-width: 768px)" srcSet={imageMobile} />
                    )}
                    <img
                      src={image}
                      alt={title}
                      className="absolute inset-0 size-full object-cover object-center"
                      loading={index === 0 ? 'eager' : 'lazy'}
                    />
                  </picture>

                  {/* Overlay */}
                  {overlay && (
                    <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(0_0_0/0.3),rgb(0_0_0/0.6))]" />
                  )}

                  {/* Content */}
                  <div
                    className={`relative flex size-full flex-col px-6 md:px-12 ${alignClasses[textAlign]}`}
                  >
                    <div
                      className={`mx-auto flex w-full max-w-7xl flex-col ${positionClasses[textPosition]}`}
                    >
                      {subtitle && (
                        <p className="mb-4 text-xl text-white/90 md:text-3xl">
                          {subtitle}
                        </p>
                      )}

                      {description && (
                        <p className="mb-8 max-w-2xl text-base text-white/80 md:text-lg">
                          {description}
                        </p>
                      )}

                      {cta && (
                        <a
                          href={cta.url}
                          className={`inline-block transform rounded-lg px-8 py-4 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg ${ctaClasses[cta.variant]}`}
                        >
                          {cta.text}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </>
  );
}
