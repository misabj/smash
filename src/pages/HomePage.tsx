import Hero from "../components/Hero";
import PromoBanner from "../components/PromoBanner";
import FeaturedMenu from "../components/FeaturedMenu";
import Features from "../components/Features";
import Testimonials from "../components/Testimonials";
import CTASection from "../components/CTASection";

export default function HomePage() {
    return (
        <>
            <Hero />
            <PromoBanner />
            <FeaturedMenu />
            <Features />
            <Testimonials />
            <CTASection />
        </>
    );
}
