import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Navbar from './components/Navbar';
import ThemeSwitcher from './components/ThemeSwitcher';
import ProblemsPage from './pages/ProblemsPage';
import PatternsPage from './pages/PatternsPage';
import TemplatesPage from './pages/TemplatesPage';
import './index.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="App">
          <Navbar />
          <ThemeSwitcher />
          <Routes>
            <Route path="/" element={<ProblemsPage />} />
            <Route path="/patterns" element={<PatternsPage />} />
            <Route path="/templates" element={<TemplatesPage />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
