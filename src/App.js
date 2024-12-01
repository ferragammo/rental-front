import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './Page/AuthPage';
import Home from './Page/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/login" element={<AuthPage />} />
        <Route path="/auth/register" element={<AuthPage />} />
      </Routes>
    </Router>
  );
}

export default App;
