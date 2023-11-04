import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from './pages/home';
import Layout from './pages/layout';

function App() {
  // ...
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;