import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import SinglePageHome from './pages/SinglePageHome';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><SinglePageHome /></Layout>} />
        {/* Any other path (old /login, /admin links, etc.) goes back to the homepage */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
