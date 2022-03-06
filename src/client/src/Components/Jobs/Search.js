import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('query');
  const [jobs, setJobs] = useState([]);
  const [message, setMessage] = useState('');
  async function fetchJobs() {
    const res = await fetch(`/api/jobs/search?query=${query}`);
    const data = await res.json();
    return data;
  }

  useEffect(() => {
    async function getJobs() {
      const overviewJobs = await fetchJobs();
      if (overviewJobs.jobs.length === 0) {
        setMessage('No Results Found.');
      } else {
        setMessage('');
      }
      setJobs(overviewJobs.jobs);
    }
    getJobs();
  }, [searchParams]);

  return (
    <div className="container">
      <div className="overview card my-2">
        <h3 className="card-header">Search Results</h3>
        <p className="my-3 text-center">{message}</p>
        <div className="jobs container">
          <ul className=" list-group">
            {jobs.map((job) => {
              return (
                <li
                  key={job.jobId}
                  className="p-3 my-3 bg-light list-group-item"
                >
                  <div className="job d-flex flex-row justify-content-between align-items-center my-2">
                    <div className="d-flex flex-column">
                      <h3>{job.title}</h3>
                      <h6>Company: {job.companyName}</h6>
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
    </div>
  );
}

export default Search;
