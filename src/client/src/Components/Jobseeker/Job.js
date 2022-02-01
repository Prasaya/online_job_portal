function Job({job, OnClick}) {
    return (
        <>
            <div className="job d-flex flex-row justify-content-between align-items-center my-2">
                <div className="d-flex flex-column">
                    <h3>{job.title}</h3>
                    <h6>Deadline: {job.deadline}</h6>
                </div>
                <div>
                    <button id={job.id} data-job-id={job.id} className="btn btn-primary" onClick={OnClick}>{job.applied?"Unapply":"Apply"}</button>
                    <button type="button" className="btn btn-secondary mx-2" data-bs-toggle="modal" data-bs-target={`#modal-${job.id}`}>View</button>
                </div>
            </div>
            <div class="modal fade" id={`modal-${job.id}`} tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">{job.title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <p>{job.description}</p>
                            <p>Deadline: {job.deadline}</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" data-job-id={job.id} class="btn btn-primary" onClick={OnClick}>{job.applied?"Unapply":"Apply"}</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Job;