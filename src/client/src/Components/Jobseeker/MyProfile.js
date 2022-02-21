import { useState, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import defaultAvatar from "../../Assets/Img/defaultAvatar.png"

function titleCase(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map(function (word) {
      return word.replace(word[0], word[0].toUpperCase());
    })
    .join(' ');
}
function MyProfile() {
  const [basicInfo, setBasicInfo] = useState({});
  const [skills, setSkills] = useState([]);
  const [education, setEducation] = useState([]);
  const [picture, setPicture] = useState('');
  let basicEntries = [];

  const fetchInfo = async () => {
    const res = await fetch('/api/applicant');
    const data = await res.json();
    return data.user;
  };

  useEffect(() => {
    const getInfo = async () => {
      const user = await fetchInfo();
      setBasicInfo(user.basics);
      setSkills(user.skills);
      setEducation(user.academics);
      setPicture(user.basics.picture ? '/api/applicant/avatar' : defaultAvatar);
    };
    getInfo();
  }, []);
  basicEntries = Object.entries(basicInfo);
  return (
    <div className="myprofile">
      <h1>
        My Profile{' '}
        <span>
          <Link className="btn btn-secondary" to="/jobseeker/editprofile">
            Edit
          </Link>
        </span>
      </h1>
      <div className="container bg-light profile">
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
                          {entry[1] && (
                            <tr>
                              <td>{titleCase(entry[0])}</td>
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
              <div className="skills col-6">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyProfile;
