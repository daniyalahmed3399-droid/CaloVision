import Navbar from "../components/Navbar";
import MainHero from "../components/MainHero";
import AboutSection from "../components/AboutSection";
import Services from "../components/Services";
import BMICalculator from "../components/BMICalculator";
import Expertise from "../components/Expertise";
import WeightLoss from "../components/WeightLoss";
import Pricing from "../components/Pricing";
import Blog from "../components/Blog";
import VideoTestimonials from "../components/VideoTestimonials";
import Appointment from "../components/Appointment";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main>

      <Navbar />

      {/* Actual green homepage hero */}
      <MainHero />

      {/* About Us section */}
      <AboutSection />

      <Services />

      <BMICalculator />

      <Expertise />

      <WeightLoss />

      <Pricing />

      <Blog />

      <VideoTestimonials />

      <Appointment />

      <Footer />

    </main>
  );
}