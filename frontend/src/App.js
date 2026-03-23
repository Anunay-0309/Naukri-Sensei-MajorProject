import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Upload from "./pages/Upload";
import Options from "./pages/Options";
import Domains from "./pages/Domains";
import Jobs from "./pages/Jobs";
import Quiz from "./pages/Quiz";
import Radar from "./pages/Radar";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/options" element={<Options />} />
        <Route path="/domains" element={<Domains />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/radar" element={<Radar />} />
      </Routes>
    </Router>
  );
}

export default App;