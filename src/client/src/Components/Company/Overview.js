import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Overview() {
  const [jobs, setJobs] = useState([]);

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
      <Link to="/company/jobpost" className="btn btn-primary btn-lg my-5">
        Add Job
      </Link>
      <h1>Posted Jobs</h1>
      <div className="jobs container">
        <ul className="list-group">
          {jobs.map((job) => {
            return (
              <li key={job.jobId} className="p-3 my-3 bg-light list-group-item">
                <div className="job d-flex flex-row justify-content-between align-items-center my-2">
                  <div className="d-flex flex-column">
                    <h3>{job.title}</h3>
                    <h6>Deadline: {job.deadline}</h6>
                  </div>
                  <div>
                    <Link
                      to={`/jobs/${job.jobId}`}
                      className="btn btn-secondary btn-lg mx-2"
                    >
                      View Job
                    </Link>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default Overview;
