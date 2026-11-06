import HomeNavbar from "../components/home/HomeNavbar";
import HeroSection from "../components/home/HeroSection";
import AboutSection from "../components/home/AboutSection";
import HowItWorksSection from "../components/home/HowItWorksSection";
import HomeFooter from "../components/home/HomeFooter";


import BenefitsSection from "../components/home/BenefitsSection";

function Home() {
  return (
    <>
      <HomeNavbar />
      <HeroSection />
      <AboutSection />
      <HowItWorksSection />
      <BenefitsSection />
      <HomeFooter />
    </>
  );
}

export default Home;
