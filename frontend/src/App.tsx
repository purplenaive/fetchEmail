import { Routes, Route } from "react-router-dom";
import { Email } from "./pages/Email";

// css
import './App.css';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Email />} />
      </Routes>
    </>
  );
}

export default App;
