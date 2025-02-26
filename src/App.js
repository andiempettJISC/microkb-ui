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
      <div className="site" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <div className="site-content" style={{ flex: '1' }}>
          <Routes>
            <Route path="/" element={<Packages />} />
            <Route path="/detail/:id" element={<PackageDetails />} />
            <Route path="/create" element={<div className="mt-6"><PackageUpload /></div>} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;