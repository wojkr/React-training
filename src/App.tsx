import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css';
import { Main } from './pages/main'
import { Login } from './pages/login'
import { Navbar } from './components/navbar'
import { Posts } from './pages/posts/posts';

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/createpost" element={<Posts />} />
          <Route path="/posts" element={<Posts />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
