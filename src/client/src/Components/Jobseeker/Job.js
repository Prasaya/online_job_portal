import { isTemplateExpression } from 'typescript';

function Job({ job, OnClick }) {
  return (
    <>
      <div className="job d-flex flex-row justify-content-between align-items-center my-2">
        <div className="d-flex flex-column">
          <h3>{job.title}</h3>
          <h6>Company: {job.companyName}</h6>
          <h6>Deadline: {job.deadline}</h6>
        </div>
        <div>
          <button
            id={job.jobId}
            data-job-id={job.jobId}
            className="btn btn-primary"
            onClick={OnClick}
          >
            {job.applied ? 'Unapply' : 'Apply'}
          </button>
          <button
            type="button"
            className="btn btn-secondary mx-2"
            data-bs-toggle="modal"
            data-bs-target={`#modal-${job.jobId}`}
          >
            View
          </button>
        </div>
      </div>
      <div className="modal fade" id={`modal-${job.jobId}`} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{job.title}</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="job-details mb-4">
                <table className="my-1 table table-borderless">
                  <tbody>
                    <tr>
                      <td>
                        <b>Company</b>
                      </td>
                      <td className='px-0'>:</td>
                      <td>{job.companyName}</td>
                    </tr>
                    <tr>
                      <td>
                        <b>Address</b>
                      </td>
                      <td className='px-0'>:</td>
                      <td>
                        {job.address} {job.district}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <b>Deadline</b>
                      </td>
                      <td className='px-0'>:</td>
                      <td>{job.deadline}</td>
                    </tr>
                  </tbody>
                </table>
                <div className="job-description my-2">
                  <h6>Job Description:</h6>
                  <p>{job.description}</p>
                </div>
              </div>

              <div className="job-requirements">
                <h5>Job Requirements:</h5>
                <p>Experience: {job.experience}</p>
                <div className="my-3 education">
                  <h6>Education:</h6>
                  <ul className="list-group">
                    {job.qualifications.map((education) => {
                      return (
                        <li className="list-group-item">{education.degree}</li>
                      );
                    })}
                  </ul>
                </div>
                <div className="my-3 skills">
                  <h6>Skills:</h6>
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Skill Name</th>
                        <th scope="col">Proficiency</th>
                      </tr>
                    </thead>
                    <tbody>
                      {job.skills.map((skill, index) => {
                        return (
                          <tr key={skill.id}>
                            <td>{index + 1}</td>
                            <td>{skill.name}</td>
                            <td>{skill.proficiency}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                data-job-id={job.jobId}
                className="btn btn-primary"
                onClick={OnClick}
              >
                {job.applied ? 'Unapply' : 'Apply'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Job;
