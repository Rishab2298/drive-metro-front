import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import TestimonialCard from '../../components/landing/TestimonialCard';
import AnimatedSection from '../../components/landing/AnimatedSection';

const TestimonialsCarousel = () => {
  const testimonials = [
    {
      title: "Trusted partner",
      quote: "Elementra's team listened closely to our goals and brought our ideas to life. The final web app fits our brand and is easy for our users to use every day with confidence.",
      authorImage: "/landing-images/custom-img-10-copyright.jpg",
      authorName: "Jack Smith",
      location: "Brooklyn, NY"
    },
    {
      title: "Modern solution",
      quote: "From concept to launch, Elementra made it easy. Their team built a site that works well and looks sharp, making our work much simpler and more efficient overall.",
      authorImage: "/landing-images/custom-img-11-copyright.jpg",
      authorName: "Brian Evans",
      location: "Austin, TX"
    },
    {
      title: "Great results",
      quote: "Elementra blends smart design with strong code. Our new portal is now our main hub, keeping our team and clients closely linked and working seamlessly together.",
      authorImage: "/landing-images/custom-img-12-copyright.jpg",
      authorName: "John Lewis",
      location: "Denver, CO"
    }
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-[1290px] mx-auto">
        <AnimatedSection delay={0}>
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            speed={600}
            className="testimonials-swiper pb-12"
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={index}>
                <TestimonialCard {...testimonial} />
              </SwiperSlide>
            ))}
          </Swiper>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
