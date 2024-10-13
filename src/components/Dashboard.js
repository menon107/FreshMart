import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingCart, User, Settings } from 'lucide-react';
import DynamicBackground from './DynamicBackground';


const Sidebar = ({ isOpen, closeSidebar }) => (
  <motion.aside
    initial={{ x: "-100%" }}
    animate={{ x: isOpen ? 0 : "-100%" }}
    transition={{ duration: 0.3 }}
    className="fixed inset-y-0 left-0 z-50 w-64 bg-green-800 text-white p-4 lg:relative lg:translate-x-0 h-full"
  >
    <nav className="space-y-2">
      <a href="#" className="flex items-center space-x-2 p-2 hover:bg-green-700 rounded transition-colors duration-200">
        <ShoppingCart className="h-5 w-5" />
        <span>Dashboard</span>
      </a>
      <a href="#" className="flex items-center space-x-2 p-2 hover:bg-green-700 rounded transition-colors duration-200">
        <User className="h-5 w-5" />
        <span>Profile</span>
      </a>
      <a href="#" className="flex items-center space-x-2 p-2 hover:bg-green-700 rounded transition-colors duration-200">
        <Settings className="h-5 w-5" />
        <span>Settings</span>
      </a>
    </nav>
  </motion.aside>
);

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [groceries, setGroceries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const sidebarRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    fetch('http://localhost:5000/api/user', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => setUser(data))
      .catch(() => {
        localStorage.removeItem('token');
        navigate('/');
      });

    fetch('http://localhost:5000/api/groceries', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        setGroceries(data);
        const uniqueCategories = ['All', ...new Set(data.map(item => item.category))];
        setCategories(uniqueCategories);
      })
      .catch(() => {
        localStorage.removeItem('token');
        navigate('/');
      });
  }, [navigate]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredGroceries = selectedCategory === 'All'
    ? groceries
    : groceries.filter(item => item.category === selectedCategory);

  return (
    <DynamicBackground>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <header className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="mr-4 text-green-800 hover:text-green-600 transition-colors duration-200"
            >
              {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <h1 className="text-2xl font-bold text-green-800 flex-grow">FreshMart</h1>
            {user && (
              <div className="flex items-center space-x-4">
                <span className="text-green-800">{user.name}</span>
                <img src={user.profilePicture} alt={user.name} className="w-10 h-10 rounded-full" />
              </div>
            )}
          </div>
        </header>
        <div className="flex flex-1">
          <div ref={sidebarRef} className="h-full">
            <AnimatePresence>
              {(sidebarOpen || window.innerWidth >= 1024) && (
                <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />
              )}
            </AnimatePresence>
          </div>
          <main className="flex-1 p-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-green-800 mb-6">Grocery Inventory</h2>
              <div className="mb-6 flex space-x-2 overflow-x-auto pb-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full ${
                      selectedCategory === category
                        ? 'bg-green-600 text-white'
                        : 'bg-white text-green-600 hover:bg-green-100'
                    } transition-colors duration-200`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredGroceries.map((item) => (
                  <motion.div
                    key={item.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                  >
                    <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-2">{item.name}</h3>
                      <p className="text-gray-600 mb-2">{item.category}</p>
                      <p className="text-green-600 font-bold">${item.price.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">Stock: {item.stock}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </main>
        </div>
      </div>
    </DynamicBackground>
  );
}

export default Dashboard;