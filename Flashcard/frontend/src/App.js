import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FlashcardProvider } from './context/FlashcardContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateSet from './pages/CreateSet';
import EditSet from './pages/EditSet';
import PracticeSet from './pages/PracticeSet';

function App() {
  return (
    <AuthProvider>
      <FlashcardProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/create" 
                element={
                  <PrivateRoute>
                    <CreateSet />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/edit/:id" 
                element={
                  <PrivateRoute>
                    <EditSet />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/practice/:id" 
                element={
                  <PrivateRoute>
                    <PracticeSet />
                  </PrivateRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </FlashcardProvider>
    </AuthProvider>
  );
}

export default App; 