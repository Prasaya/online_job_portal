import { useState, useEffect, Fragment } from 'react';
import { useParams } from 'react-router-dom';
import defaultAvatar from '../../Assets/Img/defaultAvatar.png';

function PublicJobseekerProfile() {
  const [basicInfo, setBasicInfo] = useState({});
  const [skills, setSkills] = useState([]);
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const { id } = useParams();
  const [picture, setPicture] = useState('');
  let basicEntries = [];
  const notDisplay = ['id', 'roles', 'type', 'picture'];

  const fetchInfo = async () => {
    const res = await fetch(`/api/user/public/${id}`);
    const data = await res.json();
    return data.userData;
  };

  useEffect(() => {
    const getInfo = async () => {
      const user = await fetchInfo();
      setBasicInfo(user.basics);
      setSkills(user.skills);
      setEducation(user.academics);
      setExperience(user.experience);
      setPicture(user.basics.picture ? user.basics.picture : defaultAvatar);
    };
    getInfo();
  }, []);
  basicEntries = Object.entries(basicInfo);
  return (
    <div className="container">
      <div className="myprofile card my-5">
        <h1 className="card-header">User Profile </h1>
        <div className="container profile p-4 my-3">
          <div className="row">
            <div className="col-10 col-sm-2">
              <img
                className="img-fluid img-thumbnail rounded float-start"
                src={picture}
                alt="profile pic"
              />
            </div>
            <div className="col-10">
              <div className="row">
                <div className="basic col-lg-6">
                  <h3>Basic information</h3>
                  <table className="table">
                    <tbody>
                      {basicEntries.map((entry) => {
                        return (
                          <Fragment key={entry[0]}>
                            {!!(entry[1] && entry[1].length) &&
                              !notDisplay.includes(entry[0].toLowerCase()) && (
                                <tr>
                                  <td className="text-capitalize">
                                    {entry[0]}
                                  </td>
                                  <td>:</td>
                                  <td>{entry[1]}</td>
                                </tr>
                              )}
                          </Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="education col-lg-6">
                  <h3>Education</h3>
                  <table className="table">
                    <tbody>
                      <tr>
                        <th>Level</th>
                        <th>Discipline</th>
                        <th>Degree</th>
                      </tr>
                      {education.map((entry) => {
                        return (
                          <tr key={entry.degree}>
                            <td>{entry.level}</td>
                            <td>{entry.discipline}</td>
                            <td>{entry.degree}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="row">
                <div className="skills col-lg-6">
                  <h3>Skills</h3>
                  <table className="table">
                    <tbody>
                      <tr>
                        <th>Skill</th>
                        <th>Proficiency</th>
                        <th>Experience</th>
                      </tr>
                      {skills.map((skill) => {
                        return (
                          <tr key={skill.name}>
                            <td>{skill.name}</td>
                            <td>{skill.proficiency}</td>
                            <td>{skill.experience}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="skills col-lg-6">
                  <h3>Experience</h3>
                  <table className="table">
                    <tbody>
                      <tr>
                        <th>Job Title</th>
                        <th>Company</th>
                        <th>Years</th>
                      </tr>
                      {/* {experience.map((exp) => {
                        return (
                          <tr key={exp.jobTitle}>
                            <td>{exp.jobTitle}</td>
                            <td>{exp.company}</td>
                            <td>{exp.years}</td>
                          </tr>
                        );
                      })} */}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PublicJobseekerProfile;
