import React from 'react';
import {
    Routes,
    Route,
    Navigate,
} from 'react-router-dom';
import Test from './pages/Test';
import Admin from './pages/Admin';
import './App.css';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Test/>}/>
            <Route path="/admin" element={<Admin/>}/>
            <Route
                path="/*"
                element={<Navigate to="/" replace />}
            />
        </Routes>
        
    );
}

export default App;
