import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./Components/Header";
import Login from "./Components/Login";
import RegisterJobSeeker from "./Components/RegisterJobSeeker";
import RegisterCompany from "./Components/RegisterCompany";
import JobseekerHome from "./Components/Jobseeker/Home"
import JobseekerOverview from "./Components/Jobseeker/Overview";
import JobseekerMyStatus from "./Components/Jobseeker/MyStatus";
import JobseekerMyProfile from "./Components/Jobseeker/MyProfile";
import JobseekerSettings from "./Components/Jobseeker/Settings";
import JobseekerEditProfile from "./Components/Jobseeker/EditProfile";
import CompanyHome from "./Components/Company/Home";
import CompanyOverview from "./Components/Company/Overview";
import CompanyProfile from "./Components/Company/Profile";
import CompanySettings from "./Components/Company/Settings";
import JobPost from "./Components/Company/JobPost";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Login />} exact />
          <Route path="/login" element={<Login />} />
          <Route path="/register-jobseeker" element={<RegisterJobSeeker />} />
          <Route path="/register-company" element={<RegisterCompany />} />
          <Route path="/jobseeker" element={<JobseekerHome />} > 
            <Route path="overview" element={<JobseekerOverview/>} />
            <Route path="mystatus" element={<JobseekerMyStatus/>} />
            <Route path="myprofile" element={<JobseekerMyProfile/>} />
            <Route path="editprofile" element={<JobseekerEditProfile/>} />
            <Route path="settings" element={<JobseekerSettings/>} />
          </Route>
          <Route path="/company" element={<CompanyHome />}>
            <Route path="overview" element={<CompanyOverview/>} />
            <Route path="profile" element={<CompanyProfile/>} />
            <Route path="settings" element={<CompanySettings/>} />
            <Route path="jobpost" element={<JobPost/>} />
          </Route> 
        </Routes>
      </div>
    </BrowserRouter>

  );
}

export default App;
