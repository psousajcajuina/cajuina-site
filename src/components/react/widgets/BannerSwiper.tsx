import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { useState, useEffect } from 'react';
import ImageOptimized from '@/components/react/common/ImageOptimized';

interface BannerData {
  title: string;
  subtitle?: string;
  description?: string;
  image: string;
  imageMobile?: string;
  cta?: string;
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

export default function BannerSwiper({ banners }: BannerSwiperProps) {
  if (!banners || banners.length === 0) return null;

  return (
    <>
      <style>{`
       /* Bullets base — branco translúcido */
        .banner-swiper .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: rgba(255, 255, 255, 0.5); /* branco suave */
          opacity: 1;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
        }

        /* Bullet ativo — branco puro com leve gradiente */
        .banner-swiper .swiper-pagination-bullet-active {
          width: 32px;
          border-radius: 6px;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 1) 0%,
            rgba(230, 230, 230, 1) 100%
          );
          box-shadow: 0 4px 12px rgba(255, 255, 255, 0.4);
        }

        /* Hover — branco mais forte */
        .banner-swiper .swiper-pagination-bullet:hover {
          background: rgba(255, 255, 255, 0.9);
          transform: scale(1.1);
        }

        .banner-swiper .swiper-pagination {
          bottom: 1.5rem !important;
          z-index: 20 !important;
          position: absolute !important;
        }

        @media (max-width: 768px) {
          .banner-swiper .swiper-pagination {
            bottom: 1rem !important;
          }
        }
      `}</style>

      <div className="relative h-[341px] w-full overflow-hidden md:h-[700px]">
        <Swiper
          className="banner-swiper size-full"
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
          {banners.map((banner, index) => (
            <SwiperSlide key={banner.id}>
              <BannerSlideContent banner={banner.data} index={index} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
}

// Componente separado para cada slide com detecção inteligente
function BannerSlideContent({
  banner,
  index,
}: {
  banner: BannerData;
  index: number;
}) {
  const [objectFit, setObjectFit] = useState<'cover' | 'contain'>('cover');
  const [imageRatio, setImageRatio] = useState<number | null>(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const aspectRatio = img.width / img.height;
      setImageRatio(aspectRatio);
      // Se aspect ratio >= 2.5 (panorâmica tipo 3:1 ou mais), usa contain
      // Senão (quadrado/vertical), usa cover para não cortar
      setObjectFit(aspectRatio >= 2.5 ? 'contain' : 'cover');
    };
    img.src = banner.image;
  }, [banner.image]);

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
  } = banner;

  const hasCTA = !!cta;

  const content = (
    <div className="bg-caju-heading-primary relative size-full">
      <picture>
        {imageMobile && (
          <source media="(max-width: 768px)" srcSet={imageMobile} />
        )}
        <ImageOptimized
          src={image}
          alt={title}
          width={1920}
          height={700}
          layout="fullWidth"
          loading={index === 0 ? 'eager' : 'lazy'}
          fetchPriority={index === 0 ? 'high' : 'auto'}
          className={`absolute inset-0 size-full object-${objectFit} object-center`}
          objectFit={objectFit}
          objectPosition="center"
          aspectRatio={imageRatio || undefined}
        />
      </picture>

      {/* Overlay */}
      {overlay && (
        <div className="absolute inset-0 bg-linear-to-b from-black/30 to-black/60" />
      )}

      {/* Content */}
      <div
        className={`relative z-10 flex size-full flex-col px-6 md:px-12 ${alignClasses[textAlign]}`}
      >
        <div
          className={`mx-auto flex w-full max-w-7xl flex-col ${positionClasses[textPosition]}`}
        >
          {subtitle && (
            <p className="mb-4 text-xl text-white/90 md:text-3xl">{subtitle}</p>
          )}

          {description && (
            <p className="mb-8 max-w-2xl text-base text-white/80 md:text-lg">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  return hasCTA ? (
    <a href={cta} className="block size-full cursor-pointer" aria-label={title}>
      {content}
    </a>
  ) : (
    content
  );
}
