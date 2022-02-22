import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
//todo:avatar edit
function EditProfile() {
    const [basicInfo, setBasicInfo] = useState({});
  const [allInfo, setAllInfo] = useState({}); //becasuse json server doesnt allow directly nested objects
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onBlur' });

  const fetchInfo = async () => {
    const res = await fetch('http://localhost:4000/company');
    const data = await res.json();
    return data;
  };

  const onSubmitForm = (data) => {
    let info = allInfo;
    info.basics = data;
    fetch(`http://localhost:4000/company`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(info),
    });
  };

  useEffect(() => {
    const getInfo = async () => {
      const info = await fetchInfo();
      setAllInfo(info);
      setBasicInfo(info['basics']);
    };
    getInfo();
  }, []);

  useEffect(() => {
    reset(basicInfo);
  }, [basicInfo, reset]);

  return (
    <div className="">
        <h3>Basics</h3>
        <div className="row">
            <div className="col-6 avatar">

            </div>
            <div className="col-lg-6 m-auto mb-2">
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
                    
                    <div className="d-grid gap-2">
                    <button className="btn btn-success btn-lg" type="submit">
                        Update
                    </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  );
}

export default EditProfile;