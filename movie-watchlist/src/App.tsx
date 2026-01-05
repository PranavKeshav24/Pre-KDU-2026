import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Watchlist from '../components/watchlist-page';
import PremiumMovie from '../components/premium-movie';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Watchlist />} />
        <Route path="/premium-movie/:id" element={<PremiumMovie  />} />
      </Routes>
    </Router>
  );
}

export default App;
