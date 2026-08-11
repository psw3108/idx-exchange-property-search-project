import './App.css';
import { Routes, Route } from 'react-router-dom';
import ListingsPage from './pages/ListingsPage/ListingsPage';
import PropertyDetailPage from './pages/PropertyDetailPage/PropertyDetailPage';

function App() {
  return (
    <Routes>
      <Route path="/properties" element={<ListingsPage />} />
      <Route path="/properties/:id" element={<PropertyDetailPage />} />
    </Routes>
  );
}

export default App;
