import { useState, useEffect } from 'react';
import Job from './Job';

function MyStatus() {
  const [jobs, setJobs] = useState([]);

  async function fetchJobs() {
    const res = await fetch('/api/applicant/jobs');
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
    // const jobId = Number(e.target.dataset.jobId);
    // fetch(`/api/applicant/jobs`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-type': 'application/json',
    //   },
    //   body: JSON.stringify({ jobId }),
    // });
  }
  return (
    <div className="mystatus">
      <h1>Applied Jobs</h1>
      <div className="jobs container">
        <ul className=" list-group">
          {jobs.map((job) => {
            return (
              <li key={job.jobId} className="p-3 my-3 bg-light list-group-item">
                <Job job={job} OnClick={toggleApply} />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default MyStatus;
