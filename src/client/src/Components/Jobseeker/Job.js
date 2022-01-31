function Job({job, OnClick}) {
    return (
        <div className="job d-flex flex-row justify-content-between align-items-center my-2">
            <div className="d-flex flex-column">
                <h3>{job.title}</h3>
                <h6>Deadline: {job.deadline}</h6>
            </div>
            <div>
                <button id={job.id} className="btn btn-primary" onClick={OnClick}>{job.applied?"Unapply":"Apply"}</button>
            </div>
        </div>
    );
}

export default Job;