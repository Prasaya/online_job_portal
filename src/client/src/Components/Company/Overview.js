import { Link } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import UserContext from '../../Context/UserContext';
import Statistics from './Statistics';

function Overview() {
  const [jobs, setJobs] = useState([]);
  const userCtx = useContext(UserContext);

  async function fetchJobs() {
    const res = await fetch('/api/organization/jobs');
    const data = await res.json();
    return data;
  }

  useEffect(() => {
    async function getJobs() {
      const overviewJobs = await fetchJobs();
      setJobs(overviewJobs.jobList);
    }
    getJobs();
  }, []);
  return (
    <div>
      <div className="post-job my-5">
        {userCtx.verifyStatus ? (
          <></>
        ) : (
          <p className="text-danger">User must be verified to post new job.</p>
        )}
        <Link
          to="/company/jobpost"
          className={`btn btn-primary btn-lg ${
            userCtx.verifyStatus ? '' : 'disabled'
          }`}
        >
          Post New Job
        </Link>
      </div>
      <div className="overview card my-2">
        <h1 className="card-header">Posted Jobs</h1>
        <div className="jobs container">
          <ul className="list-group">
            {jobs.map((job) => {
              return (
                <li
                  key={job.jobId}
                  className="p-3 my-3 bg-light list-group-item"
                >
                  <div className="job d-flex flex-row justify-content-between align-items-center my-2">
                    <div className="d-flex flex-column">
                      <h3>{job.title}</h3>
                      <h6>Deadline: {job.deadline}</h6>
                    </div>
                    <div className="d-flex">
                      <div>
                        <Link
                          to={`/jobs/${job.jobId}`}
                          className="btn btn-secondary btn-lg mx-2"
                        >
                          View Job
                        </Link>
                      </div>

                      <Statistics job={job} />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Overview;
