import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import GameSection from './components/GameSection';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import Accommodation from './pages/Accommodation';
import Loans from './pages/Loans';
import Delivery from './pages/Delivery';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Support from './pages/Support';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          {/* Home Page */}
          <Route path="/" element={
            <>
              <Hero />
              <Services />
              <GameSection />
              <Newsletter />
            </>
          } />
          
          {/* Service Pages */}
          <Route path="/accommodation" element={<Accommodation />} />
          <Route path="/loans" element={<Loans />} />
          <Route path="/delivery" element={<Delivery />} />
          
          {/* Legal & Support Pages */}
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/support" element={<Support />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          
          {/* Catch-all redirect to home (404 handling) */}
          <Route path="*" element={
            <div className="not-found-page">
              <div className="container">
                <h1>404</h1>
                <h2>Page Not Found</h2>
                <p>The page you are looking for does not exist.</p>
                <a href="/" className="home-btn">Go Back Home</a>
              </div>
            </div>
          } />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;