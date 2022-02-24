import { useEffect, useState } from 'react';

function JobSeekerOptions({ id }) {
  const [jobApplied, setApplied] = useState();

  const jobApply = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/applicant/jobs', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(id),
    });
    const jsonVal = await res.json();
    console.log(jsonVal);
  };

  return (
    <div className="container">
      <button className="btn btn-primary" onClick={jobApply}>
        Apply
      </button>
    </div>
  );
}

export default JobSeekerOptions;
