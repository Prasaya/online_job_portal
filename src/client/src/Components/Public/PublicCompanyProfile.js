import { useState, useEffect, Fragment } from 'react';
import { useParams } from 'react-router-dom';
import defaultAvatar from '../../Assets/Img/defaultAvatar.png';

function PublicCompanyProfile() {
  const [basicInfo, setBasicInfo] = useState({});
  const {id} = useParams()
  let basicEntries = [];
  const notDisplay = ['id', 'roles', 'type', 'logo'];

  const fetchInfo = async () => {
    const res = await fetch(`/api/user/${id}`);
    const data = await res.json();
    return data;
  };

  useEffect(() => {
    const getInfo = async () => {
      const user = await fetchInfo();
      user.user.basics.logo = user.user.basics.logo
        ? '/api/organization/logo'
        : defaultAvatar;
      setBasicInfo(user.user.basics);
    };
    getInfo();
  }, []);
  basicEntries = Object.entries(basicInfo);
  return (
    <div className="myprofile card my-5">
      <h1 className="card-header">
        My Profile{' '}
      </h1>
      <div className="container profile p-4 my-3">
        <div className="row">
          <div className="col-10 col-sm-2">
            <img
              className="img-fluid img-thumbnail rounded float-start"
              src={basicInfo.logo}
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
                          {entry[1] &&
                            !notDisplay.includes(entry[0].toLowerCase()) && (
                              <tr>
                                <td className="text-capitalize">{entry[0]}</td>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PublicCompanyProfile;
