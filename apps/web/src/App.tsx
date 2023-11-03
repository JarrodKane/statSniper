import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Layout from './pages/layout';
import LoginPage from './pages/login';

function App() {
  // ...
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<div>Hello</div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;