import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Packages from './Packages';
import PackageDetails from './PackageDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Packages />} />
        <Route path="/package/:id" element={<PackageDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
