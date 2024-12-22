import React, { useRef } from "react";
import './main.css';
import LearningOutcomes from './components/LearningOutcomes';
import Nav from './components/Nav';
import Header from './components/Header';
import Content from './components/Content';
import Footer from './components/Footer';
import Transition from './components/Transition';
import About from './components/About';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function Home() {
  return (
    <>
      <Header />
      <main>
        <Content />
      </main>
      <Footer />
    </> 
  );
}


function App() {
  const transitionRef = useRef(null);

  const triggerTransition = (onComplete) => {
    if (transitionRef.current) {
      transitionRef.current.playTransition(onComplete);
    } else {
      onComplete();
    }
  };

  return (
    <Router>
      <Transition ref={transitionRef} />
      <div className="container">
        <Nav triggerTransition={triggerTransition} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/learning-outcomes" element={<LearningOutcomes />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
