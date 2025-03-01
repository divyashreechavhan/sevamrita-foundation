import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import Story from './components/Story';
import Contribute from './components/Contribute';
import Contact from './components/Contact';
import Team from './components/Team';
import WhatWeDo from './components/WhatWeDo';
import Calender from './components/Calender';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/whatwedo" element={<WhatWeDo />} />
          <Route path="/story" element={<Story />} />
          <Route path="events-calender" element={<Calender/>}/>
          <Route path="/contribute" element={<Contribute />} />
          <Route path="/team" element={<Team />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}


export default App;