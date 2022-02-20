import { useState, useEffect } from 'react';

function Avatar() {
  const [avatar, setAvatar] = useState('');
  const stockPhoto =
    'http://stock.wikimini.org/w/images/9/95/Gnome-stock_person-avatar-profile.png';

  const fetchAvatar = async () => {
    const res = await fetch('/api/applicant');
    const data = await res.json();
    return data.user.basics.picture ? '/api/applicant/avatar' : stockPhoto;
  };

  useEffect(() => {
    const getAvatar = async () => {
      const data = await fetchAvatar();
      setAvatar(data);
    };
    getAvatar();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const fileInput = document.querySelector('#picture');
    const formData = new FormData();
    formData.append('avatar', fileInput.files[0]);
    const options = {
      method: 'PUT',
      body: formData,
    };
    fetch(`/api/applicant/avatar`, options);
  };
  const handleChange = (e) => {
    if (e.target.files[0].size > 1024 * 1024) {
      alert('File size should be smaller than 1 MB');
      e.target.value = '';
    } else {
      const url = URL.createObjectURL(e.target.files[0]);
      setAvatar(url);
    }
  };

  return (
    <div>
      <h3>Avatar</h3>
      <img
        className="col-3 img-thumbnail rounded mx-auto d-block"
        src={avatar}
        alt="avatar"
      />
      <div className="col-3 m-auto">
        <form className="form" onSubmit={handleSubmit}>
          <div className="mb-1 mt-1">
            <input
              name="picture"
              type="file"
              className="form-control form-control-sm"
              placeholder="Picture"
              id="picture"
              accept="image/png, image/jpeg"
              onChange={handleChange}
            />
          </div>
          <div className="d-grid gap-2">
            <button className="btn btn-success btn-sm" type="submit">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Avatar;
