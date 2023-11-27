import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import GPs from './GPs';
import Pharmacies from './Pharmacies';
import Patients from './Patients';

function App() {
  return (
    <Router>
      <div>
        <Link to="/gps"><button>GPs</button></Link>
        <Link to="/pharmacies"><button>Pharmacies</button></Link>
        <Link to="/patients"><button>Patients</button></Link>
      </div>
      <Routes>
        <Route path="/gps" element={<GPs />} />
        <Route path="/pharmacies" element={<Pharmacies />} />
        <Route path="/patients" element={<Patients />} />
      </Routes>
    </Router>
  );
}

export default App;