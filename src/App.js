import HeroSection from "./components/hero/HeroSection";
import Header from "./components/Header";
import About from "./components/About";
import ProjectList from "./components/ProjectList";
import Footer from "./components/Footer";

export default function App() {
  return (
    <>
      <HeroSection />
      {/* <About /> */}
      <ProjectList />
      <Footer />
    </>
  );
}