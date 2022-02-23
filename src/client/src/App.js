import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./Components/Header";
import Login from "./Components/Login";
import RegisterJobSeeker from "./Components/RegisterJobSeeker";
import RegisterCompany from "./Components/RegisterCompany";

//Jobseeker 
import JobseekerHome from "./Components/Jobseeker/Home";
import JobseekerOverview from "./Components/Jobseeker/Overview";
import JobseekerMyStatus from "./Components/Jobseeker/MyStatus";
import JobseekerMyProfile from "./Components/Jobseeker/MyProfile";
import JobseekerSettings from "./Components/Jobseeker/Settings";
import JobseekerEditProfile from "./Components/Jobseeker/EditProfile";
import JobseekerAvatar from "./Components/Jobseeker/EditProfile/Avatar";
import JobseekerBasics from "./Components/Jobseeker/EditProfile/Basics";
import JobseekerEducation from "./Components/Jobseeker/EditProfile/Education";
import JobseekerSkills from "./Components/Jobseeker/EditProfile/Skills";

//Company
import CompanyHome from "./Components/Company/Home";
import CompanyOverview from "./Components/Company/Overview";
import CompanyProfile from "./Components/Company/Profile";
import CompanySettings from "./Components/Company/Settings";
import JobPost from "./Components/Company/JobPost";
import CompanyEditProfile from "./Components/Company/EditProfile";
import CompanyAvatar from "./Components/Company/EditProfile/Avatar";
import CompanyBasics from "./Components/Company/EditProfile/Basics";

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
            <Route path="editprofile" element={<JobseekerEditProfile/>}>
              <Route path="avatar" element={<JobseekerAvatar/>}/>
              <Route path="basics" element={<JobseekerBasics/>}/>
              <Route path="education" element={<JobseekerEducation/>}/>
              <Route path="skills" element={<JobseekerSkills/>}/>
            </Route>
            <Route path="settings" element={<JobseekerSettings/>} />
          </Route>
          <Route path="/company" element={<CompanyHome />}>
            <Route path="overview" element={<CompanyOverview/>} />
            <Route path="profile" element={<CompanyProfile/>} />
            <Route path="editprofile" element={<CompanyEditProfile/>}>
              <Route path="avatar" element={<CompanyAvatar/>}/>
              <Route path="basics" element={<CompanyBasics/>}/>
            </Route>
            <Route path="settings" element={<CompanySettings/>} />
            <Route path="jobpost" element={<JobPost/>} />
          </Route> 
        </Routes>
      </div>
    </BrowserRouter>

  );
}

export default App;
