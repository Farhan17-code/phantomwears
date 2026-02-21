
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import FireflyCanvas from './components/FireflyCanvas';
import PhantomAI from './components/PhantomAI';
import Home from './pages/Home';
import Products from './pages/Products';
import Story from './pages/Story';
import Checkout from './pages/Checkout';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import AdminDashboard from './pages/AdminDashboard';
import AdminRoute from './components/AdminRoute';
import ProductDetails from './pages/ProductDetails';
import OrderHistory from './pages/OrderHistory';
import Wishlist from './pages/Wishlist';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

const App: React.FC = () => {
  const [soundOn, setSoundOn] = useState(false);
  const [audio] = useState(new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3'));


  useEffect(() => {
    audio.loop = true;
    audio.volume = 0.15;
    if (soundOn) {
      audio.play().catch(e => console.log("Audio play failed, user interaction needed"));
    } else {
      audio.pause();
    }
    return () => audio.pause();
  }, [soundOn, audio]);

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col">
            <FireflyCanvas />
            <Header soundOn={soundOn} setSoundOn={setSoundOn} />
            <CartDrawer />

            <main className="grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/story" element={<Story />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/orders" element={<OrderHistory />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/admin" element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } />
              </Routes>
            </main>

            <Footer />
            <PhantomAI />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
