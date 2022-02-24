import { useEffect, useState } from 'react';

function JobSeekerOptions({ id }) {
  const [jobApplied, setApplied] = useState(false);

  async function fetchJobs() {
    const res = await fetch('/api/applicant/jobs');
    const data = await res.json();
    return data;
  }

  useEffect(() => {
    async function getJobs() {
      const overviewJobs = await fetchJobs();
      overviewJobs.jobs.map((job) => {
        if (id.jobId === job.jobId) {
          setApplied(true);
        }
      });
    }
    getJobs();
  }, []);

  const jobApply = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/applicant/jobs', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(id),
    });
    const jsonVal = await res.json();
    if (jsonVal.success) {
      setApplied(true);
    }
  };

  return (
    <div className="container">
      <button className="btn btn-primary" onClick={jobApply}>
        {jobApplied ? 'Unapply' : 'Apply'}
      </button>
    </div>
  );
}

export default JobSeekerOptions;
