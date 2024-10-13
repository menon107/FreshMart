import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import DynamicBackground from './components/DynamicBackground';

function App() {
  return (
    <Router>
      <DynamicBackground>
        <Routes>
          <Route path="/" element={<Login  />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </DynamicBackground>
    </Router>
  );
}

export default App;