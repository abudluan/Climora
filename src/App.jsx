import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import NavigationBar from './components/navigationBar';

function App() {

  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route exact path='/' element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;