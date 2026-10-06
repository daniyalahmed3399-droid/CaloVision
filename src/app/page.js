import Navbar from "../components/Navbar";
import MainHero from "../components/MainHero";
import BMICalculator from "../components/BMICalculator";
import AboutSection from "../components/AboutSection";
import AICoaching from "../components/AICoaching";
import Pricing from "../components/Pricing";
import AppBanner from "../components/AppBanner";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main>

      <Navbar />

      {/* Green homepage hero */}
      <MainHero />

      {/* BMI calculator, directly below the hero (the hero button links here) */}
      <BMICalculator />

      {/* AI coaching: what it does, an example chat, and the sign-up call to action */}
      <AICoaching />

      {/* About Us section */}
      <AboutSection />

      <Pricing />

      {/* App banner, just above the footer */}
      <AppBanner />

      <Footer />

    </main>
  );
}
