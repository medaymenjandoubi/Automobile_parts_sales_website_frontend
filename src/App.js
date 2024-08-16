import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Login from "./pages/login/Login";
import Accueil from "./pages/acceuil/accueil.js";
import Register from './pages/Register/Register.js';
import Layout from './layout.js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import Marques from './pages/Marques.js';
import TypePiece from './pages/TypePiece.js';
import TypeVoiture from './pages/TypeVoiture.js';
import Piece from './pages/Piece.js';
import MarqueVoiture from './pages/MarqueVoiture.js';
import { CartProvider } from 'react-use-cart';
import NavBar from './components/NavBar.js';

function App() {
  
  return (
    <Router>
      
      <CartProvider>
        <ToastContainer position="top-center" />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Accueil />} />
            <Route path="/admin/pieces" element={<Piece />} />
            <Route path="/admin/TypePiece" element={<TypePiece />} />
            <Route path="/admin/marques" element={<Marques />} />
            <Route path="/admin/TypeVoiture" element={<TypeVoiture />} />
            <Route path="/admin/MarqueVoiture" element={<MarqueVoiture />} />
          </Route>
          <Route path="/register" element={<Register />} />
        </Routes>
      </CartProvider>
    </Router>
  );
}

export default App;
