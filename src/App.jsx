import  {BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from './components/Login'
import AdminHome from './components/AdminHome';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';


const isAuthenticated = () => {
  return localStorage.getItem('isLoggedIn') === 'true';
};


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem('isLoggedIn', 'false');
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login onLogin={handleLogin} />} />
        <Route path="/home/*" element={isLoggedIn ? <AdminHome onLogout={handleLogout} /> : <Navigate to="/" />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
