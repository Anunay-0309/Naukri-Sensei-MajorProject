import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Upload from "./pages/Upload";
import Options from "./pages/Options";
import Domains from "./pages/Domains";
import Jobs from "./pages/Jobs";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/options" element={<Options />} />
        <Route path="/domains" element={<Domains />} />
        <Route path="/jobs" element={<Jobs />} />
      </Routes>
    </Router>
  );
}

export default App;