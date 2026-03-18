import Hero from "../components/Hero";
import FeaturedMenu from "../components/FeaturedMenu";
import Features from "../components/Features";
import Testimonials from "../components/Testimonials";
import CTASection from "../components/CTASection";

export default function HomePage() {
    return (
        <>
            <Hero />
            <FeaturedMenu />
            <Features />
            <Testimonials />
            <CTASection />
        </>
    );
}
