import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./Components/Header";
import Login from "./Components/Login";
import RegisterJobSeeker from "./Components/RegisterJobSeeker";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
      </div>
      <Routes>
        <Route path="/" element={<Login />} exact />
        <Route path="/login" element={<Login />} />
        <Route path="/register-jobseeker" element={<RegisterJobSeeker />} />
      </Routes>

    </BrowserRouter>

  );
}

export default App;
