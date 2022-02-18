import { Link } from "react-router-dom";

function Overview() {
  return (
    <div>
      <h1>Posted Jobs</h1>
      <Link to="/company/jobpost" className="btn btn-primary btn-lg my-5">Add Job</Link>
    </div>
  );
}

export default Overview;
