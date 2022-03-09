import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { intervalToDuration, parse } from 'date-fns';

function Basics() {
  const [basicInfo, setBasicInfo] = useState({});
  const [isUpdateSuccess, setIsUpdateSuccess] = useState(false);
  const [isUpdateFail, setIsUpdateFail] = useState(false);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onBlur' });

  const fetchInfo = async () => {
    const res = await fetch('/api/applicant');
    const data = await res.json();
    return data.user.basics;
  };

  const onSubmitForm = async (data) => {
    const res = await fetch(`/api/applicant`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (res.status === 200) {
      setIsUpdateSuccess(true);
    } else {
      setIsUpdateFail(true);
    }
    //stop displaying after 3 seconds
    setTimeout(() => {
      setIsUpdateFail(false);
      setIsUpdateSuccess(false);
    }, 3000);
  };

  useEffect(() => {
    const getInfo = async () => {
      setBasicInfo(await fetchInfo());
    };
    getInfo();
  }, []);

  useEffect(() => {
    reset(basicInfo);
  }, [basicInfo, reset]);

  return (
    <div className="my-2">
      <h3>Basics</h3>
      <div className="col-lg-6 m-auto mb-2">
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <div className="form-floating mb-3">
            <input
              {...register('firstName', {
                required: 'Please fill out this field',
              })}
              type="text"
              className={`form-control form-control-lg ${
                errors.firstName ? 'is-invalid' : ''
              }`}
              placeholder="First Name"
              id="firstName"
            />
            <label htmlFor="firstName">First Name</label>
            <div className="invalid-feedback">
              {errors.firstName && errors.firstName.message}
            </div>
          </div>
          <div className="form-floating mb-3">
            <input
              {...register('middleName')}
              type="text"
              className="form-control form-control-lg"
              placeholder="Middle Name"
              id="middleName"
            />
            <label htmlFor="middleName">Middle Name</label>
          </div>
          <div className="form-floating mb-3">
            <input
              {...register('lastName', {
                required: 'Please fill out this field',
              })}
              type="text"
              className={`form-control form-control-lg ${
                errors.lastName ? 'is-invalid' : ''
              }`}
              placeholder="Last Name"
              id="lastName"
            />
            <label htmlFor="lastName">Last Name</label>
            <div className="invalid-feedback">
              {errors.lastName && errors.lastName.message}
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
              {...register('birthday', {
                required: 'Please fill out this field',
                validate: (value) => {
                  const birthday = parse(value, 'yyyy-MM-dd', new Date());
                  const today = new Date();
                  const duration = intervalToDuration({
                    start: birthday,
                    end: today,
                  });
                  if (
                    duration.years < 16 ||
                    birthday.getFullYear() > today.getFullYear()
                  ) {
                    return 'Should be older than 16.';
                  } else if (duration.years > 100) {
                    return 'Should be younger than 100.';
                  }
                },
              })}
              type="date"
              className={`form-control form-control-lg ${
                errors.birthday ? 'is-invalid' : ''
              }`}
              placeholder="Birthday"
              id="birthday"
            />
            <label htmlFor="birthday">Birthday</label>
            <div className="invalid-feedback">
              {errors.birthday && errors.birthday.message}
            </div>
          </div>
          <div className="form-floating mb-3">
            <select
              {...register('gender', {
                required: 'Please fill out this field',
              })}
              className={`form-select ${errors.gender ? 'is-invalid' : ''}`}
              id="gender"
            >
              <option selected disabled value="">
                Choose...
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <label htmlFor="gender">Gender</label>
            <div className="invalid-feedback">
              {errors.gender && errors.gender.message}
            </div>
          </div>
          <div className="message my-2 text-center">
            {isUpdateSuccess && (
              <p className="text-success">Updated Successfully</p>
            )}
            {isUpdateFail && <p className="text-danger">Update Failed</p>}
          </div>
          <div className="d-grid gap-2">
            <button className="btn btn-success btn-lg" type="submit">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Basics;
