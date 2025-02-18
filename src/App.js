import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Packages from './Packages';
import PackageDetails from './PackageDetails';
import PackageUpload from './PackageUpload';
import Navbar from './Navbar';
import Footer from './Footer';



function App() {
  return (
    <Router>
      <div className="site">
        <Navbar />
        <div className="site-content mt-6">
          <Routes>
            <Route path="/" element={<Packages />} />
            <Route path="/detail/:id" element={<PackageDetails />} />
            <Route path="/create" element={<PackageUpload />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
