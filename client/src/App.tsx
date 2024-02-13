import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "./styles/App.css";
import Login from "./pages/Login";
import Navbar from "./components/Navbar"; // Import Navbar component
import Account from "./pages/Account";
import MyBook from "./pages/MyBook";
import Home from "./pages/Home";

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();

  return (
    <>
      {location.pathname !== "/login" && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mybook" element={<MyBook />} />
        <Route path="/account/:userId" element={<Account />} />
      </Routes>
    </>
  );
}

export default App;
