function Job({job, OnClick}) {
    return (
        <>
            <div className="job d-flex flex-row justify-content-between align-items-center my-2">
                <div className="d-flex flex-column">
                    <h3>{job.title}</h3>
                    <h6>Deadline: {job.deadline}</h6>
                </div>
                <div>
                    <button id={job.jobId} data-job-id={job.jobId} className="btn btn-primary" onClick={OnClick}>{job.applied?"Unapply":"Apply"}</button>
                    <button type="button" className="btn btn-secondary mx-2" data-bs-toggle="modal" data-bs-target={`#modal-${job.jobId}`}>View</button>
                </div>
            </div>
            <div className="modal fade" id={`modal-${job.jobId}`} tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">{job.title}</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p>{job.description}</p>
                            <p>Deadline: {job.deadline}</p>
                            <p>{job.companyName}, {job.address}, {job.district}</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" data-job-id={job.jobId} className="btn btn-primary" onClick={OnClick}>{job.applied?"Unapply":"Apply"}</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Job;