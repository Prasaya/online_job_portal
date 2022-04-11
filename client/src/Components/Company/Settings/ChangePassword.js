import { useForm } from 'react-hook-form';
import { useRef } from 'react';
function ChangePassword() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
  });
  const password = useRef();
  password.current = watch('password', '');

  const onSubmitForm = (data) => console.log(data);
  return (
    <div className="my-3">
      <h3>Password</h3>
      <div className="container ">
        <div className="row d-flex justify-content-center">
          <form action="#" onSubmit={handleSubmit(onSubmitForm)}>
            <div className="form-floating mb-3">
              <input
                {...register('currentPassword', {
                  required: true,
                  pattern: {
                    value:
                      /(?=.*)(?=.*[a-z])(?=.*[A-Z])(?=.*?[~`!@#$%^&*()\-_=+[\]{};:\x27.,\x22\\|/?><])(?=.*[0-9]).{8,20}/,
                  },
                })}
                type="password"
                className={`form-control form-control-lg ${
                  errors.currentPassword ? 'is-invalid' : ''
                }`}
                placeholder="Current Password"
                id="currentPassword"
              />
              <label htmlFor="currentPassword">Current Password</label>
              <div
                className={`form-text invalid-feedback ${
                  errors.currentPassword ? 'invalid-feedback' : ''
                }`}
              >
                {errors.currentPassword && 'Incorrect Password'}
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
                  errors.newPassword ? 'is-invalid' : ''
                }`}
                placeholder="New Password"
                id="newPassword"
              />
              <label htmlFor="newPassword">New Password</label>
              <div
                className={`form-text invalid-feedback ${
                  errors.newPassword ? 'invalid-feedback' : ''
                }`}
              >
                {errors.newPassword &&
                  'Password must be 8-20 characters and must be a mix of small and capital letters, numbers and symbols'}
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
            <button className="btn btn-lg btn-primary" type="submit">
              Update
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
