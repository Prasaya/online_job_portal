import { useForm } from 'react-hook-form';
function ChangeEmail() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
  });

  const onSubmitForm = (data) => console.log(data);
  return (
    <div className="my-3">
      <h3>Email</h3>
      <div className="container ">
        <div className="row d-flex justify-content-center">
          <form action="#" onSubmit={handleSubmit(onSubmitForm)}>
            <div className="form-floating mb-3">
              <input
                {...register('currentEmail', {
                  required: true,
                })}
                type="email"
                className={`form-control form-control-lg ${
                  errors.currentPassword ? 'is-invalid' : ''
                }`}
                placeholder="Current Email"
                id="currentEMail"
              />
              <label htmlFor="currentEmail">Current Email</label>
              <div
                className={`form-text invalid-feedback ${
                  errors.currentEmail ? 'invalid-feedback' : ''
                }`}
              >
                {errors.currentEmail && 'Incorrect Email'}
              </div>
            </div>

            <div className="form-floating mb-3">
              <input
                {...register('newEmail', {
                  required: true,
                })}
                type="email"
                className={`form-control form-control-lg ${
                  errors.newEmail ? 'is-invalid' : ''
                }`}
                placeholder="New Email"
                id="newEmail"
              />
              <label htmlFor="newEmail">New Email</label>
              <div
                className={`form-text invalid-feedback ${
                  errors.newEmail ? 'invalid-feedback' : ''
                }`}
              >
                {errors.newEmail && 'Invalid Email'}
              </div>
            </div>
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
            <button className="btn btn-primary btn-lg" type="submit">
              Update
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChangeEmail;
