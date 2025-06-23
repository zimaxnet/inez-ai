import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AccountPage from './AccountPage';
import ActivationPage from './ActivationPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<AccountPage />} />
          <Route path="/activate" element={<ActivationPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
