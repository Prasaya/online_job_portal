import { useParams, Link } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import JobSeekerOptions from './JobSeekerOptions';
import CompanyOptions from './CompanyOptions';
import UserContext from '../../Context/UserContext';

function Job() {
  const userCtx = useContext(UserContext);
  const [job, setJob] = useState();
  const { id } = useParams();
  const [isLoading, setLoading] = useState(true);
  const [isValid, setValid] = useState(false);

  async function fetchJobs() {
    const res = await fetch(`/api/jobs/${id}`);
    const data = await res.json();
    return data;
  }

  useEffect(() => {
    async function getJobs() {
      const overviewJobs = await fetchJobs();
      if (overviewJobs.success) {
        setJob(overviewJobs.jobDetails);
        setValid(true);
      } else {
        setValid(false);
      }
      setLoading(false);
    }
    getJobs();
  }, []);

  if (isLoading) {
    return (
      <div className="container m-5">
        <h6>Loading...</h6>
      </div>
    );
  }
  if (!isValid) {
    return (
      <div className="container m-5">
        <h6>Job doesn't exist.</h6>
      </div>
    );
  }

  let buttons = null;

  if (!userCtx.authStatus) {
    buttons = (
      <Link to="/login" className="btn btn-secondary">
        Sign In to Apply
      </Link>
    );
  } else if (userCtx.type === 'Users') {
    buttons = <JobSeekerOptions id={job} />;
  } else if (userCtx.type === 'Organizations') {
    buttons = <CompanyOptions job={job} />;
  }

  return (
    <div className="container job bg-light p-5 my-4">
      <div className="px-5">
        <h2>{job.title}</h2>
        <div className="job-details mb-4">
          <div className="basic-details mt-3">
            <h6>Posted By:</h6>
            <p>{job.companyName}</p>
            <h6>Address:</h6>
            <p>
              {job.address}, {job.district}
            </p>
            <h6>Deadline:</h6>
            <p>{job.deadline}</p>
            <h6>No. of Vacancies:</h6>
            <p>{job.vacancies}</p>
          </div>
          <div className="job-description my-2">
            <h6>Job Description:</h6>
            <p>{job.description}</p>
          </div>
        </div>
        <div className="job-requirements row">
          <h5>Job Requirements:</h5>
          <div className="experience mt-3">
            <h6>Experience:</h6>
            <p>{job.experience} years</p>
          </div>

          <div className="mt-3 education col-lg-6">
            <h6>Education:</h6>
            <ul className="list-group-flush">
              {job.qualifications.map((education) => {
                return (
                  <li className="list-group-item bg-light">
                    {education.degree}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="mt-3 skills col-lg-7">
            <h6>Skills:</h6>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Skill Name</th>
                  <th scope="col">Proficiency</th>
                </tr>
              </thead>
              <tbody>
                {job.skills.map((skill, index) => {
                  return (
                    <tr key={skill.id}>
                      <td>{index + 1}</td>
                      <td>{skill.name}</td>
                      <td>{skill.proficiency}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="buttons my-3">{buttons}</div>
      </div>
    </div>
  );
}

export default Job;
