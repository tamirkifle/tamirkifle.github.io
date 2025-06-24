import Header from "./components/Header";
import About from "./components/About";
import ProjectList from "./components/ProjectList";
import Footer from "./components/Footer";
import { ThemeProvider } from "./context/ThemeContext";

export default function App() {
  return (
    <ThemeProvider>
      <Header />
      <About />
      <ProjectList />
      <Footer />
    </ThemeProvider>
  );
}
