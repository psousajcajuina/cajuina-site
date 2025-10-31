import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';

interface Post {
  id: string;
  title: string;
  excerpt?: string;
  content?: string;
  image?: string;
  permalink: string;
}

interface NewsSwiperProps {
  posts: Post[];
  arrowNext: string;
  arrowPrev: string;
}

export default function NewsSwiper({
  posts,
  arrowNext,
  arrowPrev,
}: NewsSwiperProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <>
      <style>{`
        .news-swiper-wrapper {
          position: relative;
          margin-top: 1.5rem;
        }
        
        .news-swiper-wrapper .swiper {
          width: 350px;
          height: 300px;
          margin-left: auto;
          margin-right: auto;
        }
        
        .news-swiper-wrapper .swiper-slide {
          width: auto;
          max-width: 180px;
        }
        
        .news-swiper-wrapper .card {
          font-family: 'Inter', sans-serif;
          font-weight: 400;
          text-align: left;
        }
        
        .news-swiper-wrapper .card > *:not(.card-image) {
          padding-left: 0.25rem;
          padding-right: 0.25rem;
        }
        
        .news-swiper-wrapper .card-image {
          margin-left: auto;
          margin-right: auto;
          margin-bottom: 0.75rem;
          height: 116px;
          width: 100%;
          border-radius: 0.5rem;
          object-fit: cover;
        }
        
        .news-swiper-wrapper .swiper-button-prev,
        .news-swiper-wrapper .swiper-button-next {
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .news-swiper-wrapper .swiper-button-prev::after,
        .news-swiper-wrapper .swiper-button-next::after {
          content: '';
        }
        
        .news-swiper-wrapper .swiper-button-prev {
          left: 0;
        }
        
        .news-swiper-wrapper .swiper-button-next {
          right: 0;
        }
        
        .news-swiper-wrapper .nav-arrow {
          width: 3rem;
          height: 3rem;
          transition: transform 0.3s;
        }
        
        .news-swiper-wrapper .nav-arrow:hover {
          transform: scale(1.1);
        }
        
        @media (min-width: 768px) {
          .news-swiper-wrapper .nav-arrow {
            width: 3.5rem;
            height: 3.5rem;
          }
        }
      `}</style>

      <div className="news-swiper-wrapper relative">
        <Swiper
          modules={[Navigation, Autoplay]}
          slidesPerView={2}
          spaceBetween={20}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
          navigation={{
            nextEl: '.news-swiper-wrapper .swiper-button-next',
            prevEl: '.news-swiper-wrapper .swiper-button-prev',
          }}
        >
          {posts.map((post) => (
            <SwiperSlide key={post.id}>
              <div className="card">
                {post.image && (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="card-image"
                    loading="lazy"
                  />
                )}

                <h5 className="text-caju-heading-primary h-[42px] text-lg">
                  {post.title}
                </h5>

                <p className="mt-1 line-clamp-2 h-[60px] text-sm">
                  {post.excerpt || post.content}
                </p>

                <a
                  href={post.permalink}
                  className="inline-block h-[29px] w-[82px] rounded bg-green-600 px-4 py-1 text-center text-sm font-medium text-white transition-all duration-300 hover:bg-green-700"
                >
                  Leia Mais
                </a>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Buttons */}
        <button className="swiper-button-prev" aria-label="Anterior">
          <img src={arrowPrev} alt="" className="nav-arrow" />
        </button>
        <button className="swiper-button-next" aria-label="Próximo">
          <img src={arrowNext} alt="" className="nav-arrow" />
        </button>
      </div>
    </>
  );
}