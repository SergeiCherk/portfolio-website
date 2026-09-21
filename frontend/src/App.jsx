import { Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { ThemeProvider } from "./context/ThemeContext";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import ProjectDetail from "./pages/ProjectDetail";
import Projects from "./pages/Projects";

// Корневой компонент: тема + шапка/подвал на всех страницах + маршруты.
// Новую страницу добавляй сюда одной строкой <Route ... />.
function App() {
  return (
    <ThemeProvider>
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          {/* Любой другой адрес — страница 404. Держи этот маршрут последним. */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </ThemeProvider>
  );
}

export default App;
