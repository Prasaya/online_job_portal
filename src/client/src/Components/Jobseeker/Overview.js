import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Job from './Job';

function Overview() {
  const [jobs, setJobs] = useState([]);

  async function fetchJobs() {
    const res = await fetch('/api/jobs?page=1');
    const data = await res.json();
    return data;
  }

  useEffect(() => {
    async function getJobs() {
      const overviewJobs = await fetchJobs();
      setJobs(overviewJobs.jobs);
    }
    getJobs();
  }, []);

  async function toggleApply(e) {
    const toggleJobID = Number(e.target.dataset.jobId);
    var updatedJob = {};
    const newJobs = jobs.map((job) => {
      if (job.id === toggleJobID) {
        job.applied = !job.applied;
        updatedJob = job;
      }
      return job;
    });
    setJobs(newJobs);

    fetch(`http://localhost:4000/jobs/${toggleJobID}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(updatedJob),
    });
  }

  return (
    <div className="overview ">
      <h1>Overview</h1>
      <div className="jobs container">
        <ul className=" list-group">
          {jobs.map((job) => {
            return (
              <li key={job.jobId} className="p-3 my-3 bg-light list-group-item">
                <div className="job d-flex flex-row justify-content-between align-items-center my-2">
                  <div className="d-flex flex-column">
                    <h3>{job.title}</h3>
                    <h6>Company: {job.companyName}</h6>
                    <h6>Deadline: 2022-03-10</h6>
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
