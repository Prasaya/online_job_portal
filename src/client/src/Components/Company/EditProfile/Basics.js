import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
function Basics() {
  const [basicInfo, setBasicInfo] = useState({});
  const [isUpdateSuccess, setIsUpdateSuccess] = useState(false)
  const [isUpdateFail, setIsUpdateFail] = useState(false)
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onBlur' });

  const fetchInfo = async () => {
    const res = await fetch('/api/user');
    const data = await res.json();
    return data;
  };

  const onSubmitForm = async (data) => {
    const res = await fetch(`http://localhost:4000/company`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if(res.status === 200){
        setIsUpdateSuccess(true)
      }else{
        setIsUpdateFail(true)
      }
      //stop displaying after 3 seconds
      setTimeout(() => {
        setIsUpdateFail(false)
        setIsUpdateSuccess(false)
      }, 3000);
  };

  useEffect(() => {
    const getInfo = async () => {
      const info = await fetchInfo();
      setBasicInfo(info.user.basics);
    };
    getInfo();
  }, []);

  useEffect(() => {
    reset(basicInfo);
  }, [basicInfo, reset]);
  return (
    <>
      <h3>Basics</h3>
      <div className="row">
        <div className="m-auto mb-2">
          <form onSubmit={handleSubmit(onSubmitForm)}>
            <div className="form-floating mb-3">
              <input
                {...register('name', {
                  required: 'Please fill out this field',
                })}
                type="text"
                className={`form-control form-control-lg ${
                  errors.name ? 'is-invalid' : ''
                }`}
                placeholder="Name"
                id="name"
              />
              <label htmlFor="name">Name</label>
              <div className="invalid-feedback">
                {errors.name && errors.name.message}
              </div>
            </div>
            <div className="form-floating mb-3">
              <input
                {...register('address', {
                  required: 'Please fill out this field',
                })}
                type="text"
                className={`form-control form-control-lg ${
                  errors.city ? 'is-invalid' : ''
                }`}
                placeholder="Address"
                id="address"
              />
              <label htmlFor="address">Address</label>
            </div>
            <div className="form-floating mb-3">
              <input
                {...register('city', {
                  required: 'Please fill out this field',
                })}
                type="text"
                className={`form-control form-control-lg ${
                  errors.city ? 'is-invalid' : ''
                }`}
                placeholder="City"
                id="city"
              />
              <label htmlFor="city">City</label>
              <div className="invalid-feedback">
                {errors.city && errors.city.message}
              </div>
            </div>

            <div className="form-floating mb-3">
              <input
                {...register('phone', {
                  pattern: {
                    value: /^[0-9\b]+$/,
                    message: 'Phone number must be a number',
                  },
                  required: 'Please fill out this field',
                })}
                type="text"
                className={`form-control form-control-lg ${
                  errors.phone ? 'is-invalid' : ''
                }`}
                placeholder="Phone Number"
                id="phoneNumber"
              />
              <label htmlFor="phoneNumber">Phone Number</label>
              <div className="invalid-feedback">
                {errors.phone && errors.phone.message}
              </div>
            </div>
            <div className="form-floating mb-3">
              <input
                {...register('website', {
                  required: 'Please fill out this field',
                })}
                type="website"
                className={`form-control form-control-lg ${
                  errors.city ? 'is-invalid' : ''
                }`}
                placeholder="https://mywebsite.com"
                id="website"
              />
              <label htmlFor="website">Website</label>
              <div className="invalid-feedback">
                {errors.website && errors.website.message}
              </div>
            </div>
            <div className="form-floating mb-3">
              <textarea
                {...register('description')}
                className="form-control"
                id="description"
                rows="3"
              />
              <label className="form-label" htmlFor="description">
                Company Description
              </label>
            </div>
            
            {isUpdateSuccess && <p className='text-success'>Updated Successfully</p>}
            {isUpdateFail && <p className='text-danger'>Update Failed</p>}

            <div className="d-grid gap-2">
              <button className="btn btn-success btn-lg" type="submit">
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Basics;
