import { useEffect, useState } from 'react';

function Statistics({ job }) {
  const [statistics, setStatistics] = useState();
  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/statistics/${job.jobId}`);
      const data = await res.json();
      if (data.success) {
        setStatistics(data);
      }
    })();
  }, []);

  return (
    <div>
      <button
        type="button"
        className="btn btn-primary btn-lg mx-2"
        data-bs-toggle="modal"
        data-bs-target="#statisticModal"
      >
        View Statistics
      </button>

      <div
        className="modal modal-dialog-scrollable fade"
        id="statisticModal"
        tabIndex="-1"
        aria-labelledby="modalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modalLabel">
                {' '}
                {job.title} Statistics
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p>Total Notifications Sent: {7}</p>
              <p>Total Job Post Views: {4}</p>
              <p>Views from Email: {10}</p>
              <p>Views from SMS: {10}</p>
              <p>Total Applicants: {job.applicants.length}</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Statistics;
