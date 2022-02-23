import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

function Job() {
  const [job, setJob] = useState();
  const { id } = useParams();
  const [isLoading, setLoading] = useState(true);
  const [isValid, setValid] = useState(false);

  async function fetchJobs() {
    const res = await fetch(`/api/jobs/${id}`);
    const data = await res.json();
    return data;
  }

  useEffect(() => {
    async function getJobs() {
      const overviewJobs = await fetchJobs();
      if(overviewJobs.success) {
        setJob(overviewJobs.jobDetails);
        setValid(true);
      } else {
        setValid(false);
      }
      setLoading(false);
    }
    getJobs();
  }, []);


  if(isLoading) {
    return <div className="container"><h6>Loading...</h6></div>
  }
  if(!isValid) {
    return <div className="container"><h6>Job doesn't exist.</h6></div>
  }
  return <div className="container job">Something {job.companyName}</div>;
}

export default Job;
