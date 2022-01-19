import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./Components/Header";
import Login from "./Components/Login";
import RegisterJobSeeker from "./Components/RegisterJobSeeker";
import JobseekerHome from "./Components/Jobseeker/Home"
import JobseekerOverview from "./Components/Jobseeker/Overview";
import JobseekerMyStatus from "./Components/Jobseeker/MyStatus";
import JobseekerMyProfile from "./Components/Jobseeker/MyProfile";
import JobseekerSettings from "./Components/Jobseeker/Settings";

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
            <Route path="overview" element={<JobseekerOverview/>} />
            <Route path="mystatus" element={<JobseekerMyStatus/>} />
            <Route path="myprofile" element={<JobseekerMyProfile/>} />
            <Route path="settings" element={<JobseekerSettings/>} />
          </Route> 
        </Routes>
      </div>
    </BrowserRouter>

  );
}

export default App;
