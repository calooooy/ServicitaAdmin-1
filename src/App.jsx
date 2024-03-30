import  {BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from './components/Login'
import AdminHome from './components/AdminHome';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home/*" element={<AdminHome />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
