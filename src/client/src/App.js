import { BrowserRouter, Route, Routes } from 'react-router-dom';

//Public
import Header from './Components/Header';
import Login from './Components/Login';
import RegisterJobSeeker from './Components/RegisterJobSeeker';
import RegisterCompany from './Components/RegisterCompany';
import PageNotFound from './Components/PageNotFound';
import Job from './Components/Jobs/Job';
import Search from './Components/Jobs/Search';
import PublicCompanyProfile from './Components/Public/PublicCompanyProfile';

//Jobseeker
import JobseekerHome from './Components/Jobseeker/Home';
import JobseekerOverview from './Components/Jobseeker/Overview';
import JobseekerMyStatus from './Components/Jobseeker/MyStatus';
import JobseekerMyProfile from './Components/Jobseeker/MyProfile';
import JobseekerSettings from './Components/Jobseeker/Settings';
import JobseekerSettingsBasics from './Components/Jobseeker/Settings/Basics';
import JobseekerChangeEmail from './Components/Jobseeker/Settings/ChangeEmail';
import JobseekerChangePassword from './Components/Jobseeker/Settings/ChangePassword';
import JobseekerEditProfile from './Components/Jobseeker/EditProfile';
import JobseekerAvatar from './Components/Jobseeker/EditProfile/Avatar';
import JobseekerBasics from './Components/Jobseeker/EditProfile/Basics';
import JobseekerEducation from './Components/Jobseeker/EditProfile/Education';
import JobseekerExperience from './Components/Jobseeker/EditProfile/Experience';
import JobseekerSkills from './Components/Jobseeker/EditProfile/Skills';

//Company
import CompanyHome from './Components/Company/Home';
import CompanyOverview from './Components/Company/Overview';
import CompanyProfile from './Components/Company/Profile';
import CompanySettings from './Components/Company/Settings';
import CompanyChangeEmail from './Components/Company/Settings/ChangeEmail';
import CompanyChangePassword from './Components/Company/Settings/ChangePassword';
import JobPost from './Components/Company/JobPost';
import ApplicantList from './Components/Company/ApplicantList';
import CompanyEditProfile from './Components/Company/EditProfile';
import CompanyAvatar from './Components/Company/EditProfile/Avatar';
import CompanyBasics from './Components/Company/EditProfile/Basics';
import PublicJobseekerProfile from './Components/Public/PublicJobseekerProfile';

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
          <Route path="/jobs/:id" element={<Job />} />
          <Route path="/jobs/search" element={<Search />} />
          <Route
            path="/company-profile/:id"
            element={<PublicCompanyProfile />}
          />
          <Route path="/jobseeker" element={<JobseekerHome />}>
            <Route path="overview" element={<JobseekerOverview />} />
            <Route path="mystatus" element={<JobseekerMyStatus />} />
            <Route path="myprofile" element={<JobseekerMyProfile />} />
            <Route path="editprofile" element={<JobseekerEditProfile />}>
              <Route path="avatar" element={<JobseekerAvatar />} />
              <Route path="basics" element={<JobseekerBasics />} />
              <Route path="education" element={<JobseekerEducation />} />
              <Route path="experience" element={<JobseekerExperience />} />
              <Route path="skills" element={<JobseekerSkills />} />
            </Route>
            <Route path="settings" element={<JobseekerSettings />}>
              <Route path="basics" element={<JobseekerSettingsBasics />} />
              <Route path="email" element={<JobseekerChangeEmail />} />
              <Route path="password" element={<JobseekerChangePassword />} />
            </Route>
          </Route>
          <Route path="/company" element={<CompanyHome />}>
            <Route path="overview" element={<CompanyOverview />} />
            <Route path="profile" element={<CompanyProfile />} />
            <Route path="editprofile" element={<CompanyEditProfile />}>
              <Route path="avatar" element={<CompanyAvatar />} />
              <Route path="basics" element={<CompanyBasics />} />
            </Route>
            <Route path="settings" element={<CompanySettings />}>
              <Route path="email" element={<CompanyChangeEmail />} />
              <Route path="password" element={<CompanyChangePassword />} />
            </Route>
            <Route path="jobpost" element={<JobPost />} />
            <Route path="applicants/:id" element={<ApplicantList />} />
            <Route
              path="applicants/profile/:id"
              element={<PublicJobseekerProfile />}
            />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
