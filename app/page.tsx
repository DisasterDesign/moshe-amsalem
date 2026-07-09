import Hero from "@/components/Hero";
import ServicesGrid from "@/components/ServicesGrid";
import Process from "@/components/Process";
import TestimonialsWhatsApp from "@/components/TestimonialsWhatsApp";
import GoogleReviews from "@/components/GoogleReviews";
import CTASection from "@/components/CTASection";
import HomeContact from "@/components/HomeContact";

export default function Home() {
  return (
    <>
      <Hero />
      <ServicesGrid />
      <Process />
      <TestimonialsWhatsApp />
      <GoogleReviews />
      <CTASection />
      <HomeContact />
    </>
  );
}
