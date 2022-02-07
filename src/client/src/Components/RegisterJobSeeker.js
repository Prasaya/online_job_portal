import { useForm } from "react-hook-form";
import { useRef } from "react";

function RegisterJobSeeker() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      email: "",
    },
  });
  const password = useRef();
  password.current = watch("password", "");

  const onSubmitForm = async (data) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(data),
    });
    console.log(await res.json());
  };

  return (
    <div className="container register-account">
      <div className="row justify-content-center my-5 center-text">
        <header className="text-center">
          <h3>Job Seeker Account Registration</h3>
        </header>
        <div className="col-lg-4">
          <form onSubmit={handleSubmit(onSubmitForm)}>
            <div className="form-floating mb-3">
              <input
                {...register("firstName", {
                  required: "Please fill out this field",
                })}
                type="text"
                className={`form-control form-control-lg ${
                  errors.firstName ? "is-invalid" : ""
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
                {...register("middleName")}
                type="text"
                className="form-control form-control-lg"
                placeholder="Middle Name"
                id="middleName"
              />
              <label htmlFor="middleName">Middle Name</label>
            </div>
            <div className="form-floating mb-3">
              <input
                {...register("lastName", {
                  required: "Please fill out this field",
                })}
                type="text"
                className={`form-control form-control-lg ${
                  errors.lastName ? "is-invalid" : ""
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
                {...register("email", {
                  required: "Please fill out this field",
                  validate: (value) =>
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                      value
                    ) || "Invalid Email",
                })}
                type="email"
                className={`form-control form-control-lg ${
                  errors.email ? "is-invalid" : ""
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
                {...register("phone", {
                  required: "Please fill out this field",
                  pattern: {
                    value: /^[0-9\b]+$/,
                    message: "Phone number must be a number",
                  },
                })}
                type="text"
                className={`form-control form-control-lg ${
                  errors.phone ? "is-invalid" : ""
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
                {...register("birthday", {
                  required: "Please fill out this field",
                })}
                type="date"
                className={`form-control form-control-lg ${
                  errors.birthday ? "is-invalid" : ""
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
              <input
                {...register("password", {
                  required: true,
                  pattern: {
                    value:
                      /(?=.*)(?=.*[a-z])(?=.*[A-Z])(?=.*?[~`!@#$%^&*()\-_=+[\]{};:\x27.,\x22\\|/?><])(?=.*[0-9]).{8,20}/,
                  },
                })}
                type="password"
                className={`form-control form-control-lg ${
                  errors.password ? "is-invalid" : ""
                }`}
                placeholder="Password"
                id="password"
              />
              <label htmlFor="password">Password</label>
              <div
                className={`form-text ${
                  errors.password ? "invalid-feedback" : ""
                }`}
              >
                Password must be 8-20 characters and must be a mix of small and
                capital letters, numbers and symbols
              </div>
            </div>
            <div className="form-floating mb-3">
              <input
                {...register("confirmPassword", {
                  validate: (value) =>
                    value === password.current || "Passwords do not match",
                })}
                type="password"
                className={`form-control form-control-lg ${
                  errors.confirmPassword ? "is-invalid" : ""
                }`}
                placeholder="Confirm Password"
                id="confirmPassword"
              />
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="invalid-feedback">
                {errors.confirmPassword && errors.confirmPassword.message}
              </div>
            </div>
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

export default RegisterJobSeeker;
