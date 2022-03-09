import { useForm } from 'react-hook-form';
import { useRef, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../../Context/UserContext';
import District from '../District';
import { logIn } from './logIn';

function RegisterCompany() {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      email: '',
    },
  });
  const userCtx = useContext(UserContext);

  const password = useRef();
  password.current = watch('password', '');

  const onSubmit = async (data) => {
    const res = await fetch('/api/auth/register/organization', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const jsonVal = await res.json();
    if (!jsonVal.success) {
      setError('registerError', { message: jsonVal.message });
    } else {
      logIn({ username: data.email, password: data.password }, userCtx);
    }
  };

  const navigate = useNavigate();
  useEffect(() => {
    if (userCtx.authStatus) {
      if (userCtx.type === 'Users') {
        navigate('/jobseeker/overview', { replace: true });
      } else if (userCtx.type === 'Organizations') {
        navigate('/company/overview', { replace: true });
      }
    }
  }, [userCtx]);

  return (
    <div className="container register-account">
      <div className="row justify-content-center my-5 center-text">
        <header className="text-center">
          <h3>Company Account Registration</h3>
        </header>
        <div className="col-lg-4 my-2">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-floating mb-3">
              <input
                {...register('name', {
                  required: 'Please fill out this field',
                })}
                type="text"
                className={`form-control form-control-lg ${
                  errors.name ? 'is-invalid' : ''
                }`}
                placeholder="Company Name"
                id="companyName"
              />
              <label htmlFor="companyName">Company Name</label>
              <div className="invalid-feedback">
                {errors.name && errors.name.message}
              </div>
            </div>
            <div className="form-floating mb-3">
              <input
                {...register('email', {
                  required: 'Please fill out this field',
                  onChange: () => clearErrors('registerError'),
                  validate: (value) =>
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                      value,
                    ) || 'Invalid Email',
                })}
                type="email"
                className={`form-control form-control-lg ${
                  errors.email ? 'is-invalid' : ''
                }`}
                placeholder="Email"
                id="email"
              />
              <label htmlFor="email">Email</label>
              <div className="invalid-feedback">
                {errors.email && errors.email.message}
              </div>
            </div>
            <div className="form-floating mb-3">
              <input
                {...register('phone', {
                  required: 'Please fill out this field',
                  pattern: {
                    value: /^[0-9\b]+$/,
                    message: 'Phone number must be a number',
                  },
                })}
                type="text"
                className={`form-control form-control-lg ${
                  errors.phone ? 'is-invalid' : ''
                }`}
                placeholder="Phone Number"
                id="phone"
              />
              <label htmlFor="phone">Phone Number</label>
              <div className="invalid-feedback">
                {errors.phone && errors.phone.message}
              </div>
            </div>
            <div className="form-floating mb-3">
              <input
                {...register('password', {
                  required: true,
                  pattern: {
                    value:
                      /(?=.*)(?=.*[a-z])(?=.*[A-Z])(?=.*?[~`!@#$%^&*()\-_=+[\]{};:\x27.,\x22\\|/?><])(?=.*[0-9]).{8,20}/,
                  },
                })}
                type="password"
                className={`form-control form-control-lg ${
                  errors.password ? 'is-invalid' : ''
                }`}
                placeholder="Password"
                id="companyPassword"
              />
              <label htmlFor="companyPassword">Password</label>
              <div
                className={`form-text ${
                  errors.password ? 'invalid-feedback' : ''
                }`}
              >
                Password must be 8-20 characters and must be a mix of small and
                capital letters, numbers and symbols
              </div>
            </div>
            <div className="form-floating mb-3">
              <input
                {...register('confirmPassword', {
                  validate: (value) =>
                    value === password.current || 'Passwords do not match',
                })}
                type="password"
                className={`form-control form-control-lg ${
                  errors.confirmPassword ? 'is-invalid' : ''
                }`}
                placeholder="Confirm Password"
                id="confirmPassword"
              />
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="invalid-feedback">
                {errors.confirmPassword && errors.confirmPassword.message}
              </div>
            </div>
            <div className="form-floating mb-3">
              <input
                {...register('website', {
                  required: 'Please fill out this field',
                })}
                type="url"
                className={`form-control form-control-lg ${
                  errors.website ? 'is-invalid' : ''
                }`}
                placeholder="Website"
                id="website"
              />
              <label htmlFor="website">Website</label>
              <div className="invalid-feedback">
                {errors.website && errors.website.message}
              </div>
            </div>
            <div className="form-floating mb-3">
              <input
                {...register('address', {
                  required: 'Please fill out this field',
                })}
                type="text"
                className={`form-control form-control-lg ${
                  errors.address ? 'is-invalid' : ''
                }`}
                placeholder="Address"
                id="address"
              />
              <label htmlFor="address">Address</label>
              <div className="invalid-feedback">
                {errors.address && errors.address.message}
              </div>
            </div>
            <div className="form-floating mb-3">
              <select
                {...register('city', {
                  required: 'Please choose a valid option',
                })}
                className={`form-select ${errors.city ? 'is-invalid' : ''}`}
                id="district"
              >
                <District />
              </select>
              <label htmlFor="district">District</label>
              <div className="invalid-feedback">
                {errors.city && errors.city.message}
              </div>
            </div>
            {errors.registerError && (
              <div className="alert alert-danger my-2">
                {errors.registerError.message}
              </div>
            )}
            <div className="d-grid gap-2">
              <button className="btn btn-success btn-lg" type="submit">
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterCompany;
