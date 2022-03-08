function Statistics({ job }) {
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
              <p>Total Notifications Viewed: {4}</p>
              <p>Job Post Viewed: {10}</p>
              <p>Applicants from Notifications: {3}</p>
              <p>Total Applicants: {5}</p>
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
