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

                    <button type="button" class="btn btn-primary btn-lg mx-2" data-bs-toggle="modal" data-bs-target="#statisticModal">
                      View Statistics
                    </button>

                    <div class="modal modal-dialog-scrollable fade" id="statisticModal" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
                      <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                          <div class="modal-header">
                            <h5 class="modal-title" id="modalLabel"> {job.title} Statistics</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                          </div>
                          <div class="modal-body">
                            <p>Total Notifications Sent: {20}</p>
                            <p>Total Notifications Viewed: {5}</p>
                            <p>Applicants from Notifications: {7}</p>
                          </div>
                          <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                          </div>
                        </div>
                      </div>
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

export default Overview;
