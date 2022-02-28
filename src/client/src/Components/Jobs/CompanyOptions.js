import { Link } from 'react-router-dom';

function CompanyOptions({ job }) {
  return (
    <div className="container">
      <Link className="btn btn-primary" to={`/company/applicants/${job.jobId}`}>
        View Applicants
      </Link>
    </div>
  );
}

export default CompanyOptions;
