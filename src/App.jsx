// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Admin from './Pages/Admin';
import UsersList from './components/Userlist';
import EmploymentForm from './components/Employemenu';
import Login from './Pages/Login';
import Signup from './Pages/signin';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <div>

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Admin" element={< Admin/>} />
      <Route path="/Userlist" element={< UsersList/>} />
      <Route path="/Employemenu" element={< EmploymentForm/>} />
      <Route path="/Login" element={< Login/>} />
      <Route path="/Signup" element={< Signup/>} />
    </Routes>

    <ToastContainer position="top-right" autoClose={3000} />

    </div>
  );
}

export default App;
