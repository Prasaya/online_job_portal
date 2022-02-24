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
      if (overviewJobs.success) {
        setJob(overviewJobs.jobDetails);
        setValid(true);
      } else {
        setValid(false);
      }
      setLoading(false);
    }
    getJobs();
  }, []);

  if (isLoading) {
    return (
      <div className="container">
        <h6>Loading...</h6>
      </div>
    );
  }
  if (!isValid) {
    return (
      <div className="container">
        <h6>Job doesn't exist.</h6>
      </div>
    );
  }
  return (
    <div className="container job">
      <h2>{job.title}</h2>
      <div className="job-details mb-4">
        <table className="my-1 table table-borderless">
          <tbody>
            <tr>
              <td>
                <b>Company</b>
              </td>
              <td className="px-0">:</td>
              <td>{job.companyName}</td>
            </tr>
            <tr>
              <td>
                <b>Address</b>
              </td>
              <td className="px-0">:</td>
              <td>
                {job.address} {job.district}
              </td>
            </tr>
            <tr>
              <td>
                <b>Deadline</b>
              </td>
              <td className="px-0">:</td>
              <td>2022-03-10</td>
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
              return <li className="list-group-item">{education.degree}</li>;
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
  );
}

export default Job;
