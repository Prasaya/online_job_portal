import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./Components/Header";
import Login from "./Components/Login";
import RegisterJobSeeker from "./Components/RegisterJobSeeker";
import JobseekerHome from "./Components/Jobseeker/Home"
import Overview from "./Components/Jobseeker/Overview";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Login />} exact />
          <Route path="/login" element={<Login />} />
          <Route path="/register-jobseeker" element={<RegisterJobSeeker />} />
          <Route path="/jobseeker" element={<JobseekerHome />} > 
            <Route path="overview" element={<Overview/>} />
          </Route> 
        </Routes>
      </div>
    </BrowserRouter>

  );
}

export default App;
