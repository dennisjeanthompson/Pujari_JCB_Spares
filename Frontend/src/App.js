import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import UserProfile from "./components/UserProfile/UserProfile";
import ProductDetails from "./components/ProductDetails/ProductDetails";
import AdminPage from "./components/AdminPage/AdminPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/home" element={<Home/>}/>
          <Route path="/change-password" element={<ForgotPassword/>}/>
          <Route path="/profile" element={<UserProfile/>}/>
          <Route path="/product-details" element={<ProductDetails/>}/>
          <Route path="/admin" element={<AdminPage/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
