import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function MyStatus() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setLoading] = useState(true);

  async function fetchJobs() {
    const res = await fetch('/api/applicant/jobs');
    const data = await res.json();
    return data;
  }

  useEffect(() => {
    async function getJobs() {
      const overviewJobs = await fetchJobs();
      overviewJobs.jobs.map((job) => {
        (async () => {
          const res = await fetch(`/api/applicant/jobs/rank/${job.jobId}`);
          const data = await res.json();
          job.ranking = data.data;
          return job;
        })();
      });
      setJobs(overviewJobs.jobs);
      setTimeout(() => setLoading(false), 1000);
    }
    getJobs();
  }, []);

  if (isLoading) {
    return <>Loading...</>;
  }

  return (
    <div className="mystatus card my-5">
      <h1 className="card-header">Applied Jobs</h1>
      <div className="jobs container">
        <ul className=" list-group">
          {jobs.map((job) => {
            return (
              <li key={job.jobId} className="p-3 my-3 bg-light list-group-item">
                <div className="job d-flex flex-row justify-content-between align-items-center my-2">
                  <div className="d-flex flex-column">
                    <h3>{job.title}</h3>
                    <h6>Company: {job.companyName}</h6>
                    <h6>Deadline: {job.deadline}</h6>
                    <h6>
                      Ranking: {job.ranking.rank} /{' '}
                      {job.ranking.totalApplicants}
                    </h6>
                  </div>
                  <div>
                    <div className="buttons">
                      <Link
                        to={`/jobs/${job.jobId}`}
                        className="btn btn-secondary btn-lg m-2"
                      >
                        View Job
                      </Link>
                    </div>
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

export default MyStatus;
