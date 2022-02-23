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
      setJobs(overviewJobs);
    }
    getJobs();
  }, []);

  async function toggleApply(e) {
    const jobId = Number(e.target.dataset.jobId);
    fetch(`/api/applicant/jobs`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ jobId }),
    });
  }
  return (
    <div className="mystatus">
      <h1>Applied Jobs</h1>
      <div className="jobs container bg-light">
        {jobs.map((job) => {
          return <Job job={job} OnClick={toggleApply} />;
        })}
      </div>
    </div>
  );
}

export default MyStatus;
