import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./Components/Header";
import Login from "./Components/Login";
import RegisterJobSeeker from "./Components/RegisterJobSeeker";

function App() {
  return (
    <BrowserRouter>
      <div className="App container">
        <Header />
        <Routes>
          <Route path="/" element={<Login />} exact />
          <Route path="/login" element={<Login />} />
          <Route path="/register-jobseeker" element={<RegisterJobSeeker />} />
        </Routes>
      </div>
    </BrowserRouter>

  );
}

export default App;
