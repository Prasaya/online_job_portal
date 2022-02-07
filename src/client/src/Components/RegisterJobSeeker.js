import { useForm } from "react-hook-form";

function RegisterJobSeeker() {
  const { register, handleSubmit } = useForm();
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
                {...register("firstName", { required: true })}
                type="text"
                className="form-control form-control-lg"
                placeholder="First Name"
                id="firstName"
              />
              <label htmlFor="firstName">First Name</label>
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
                {...register("lastName", { required: true })}
                type="text"
                className="form-control form-control-lg"
                placeholder="Last Name"
                id="lastName"
              />
              <label htmlFor="lastName">Last Name</label>
            </div>
            <div className="form-floating mb-3">
              <input
                {...register("email", { required: true })}
                type="email"
                className="form-control form-control-lg"
                placeholder="Email"
                id="email"
              />
              <label htmlFor="email">Email</label>
            </div>
            <div className="form-floating mb-3">
              <input
                {...register("phone", {})}
                type="tel"
                defaultValue={""}
                className="form-control form-control-lg"
                placeholder="Phone Number"
                id="phoneNumber"
              />
              <label htmlFor="phoneNumber">Phone Number</label>
            </div>
            <div className="form-floating mb-3">
              <input
                {...register("birthday", { required: true })}
                type="date"
                className="form-control form-control-lg"
                placeholder="Birthday"
                id="birthday"
              />
              <label htmlFor="birthday">Birthday</label>
            </div>
            <div className="form-floating mb-3">
              <input
                {...register("password", {
                  required: true,
                  pattern: /(?=.*)(?=.*[a-z])(?=.*[A-Z]).{8,}/,
                })}
                type="password"
                title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
                className="form-control form-control-lg"
                placeholder="Password"
                id="password"
              />
              <label htmlFor="password">Password</label>
            </div>
            {/* <select {...register("faculty", {required:true})} className="form-select form-select-lg my-2" >
                            <option value="BCT">BCT</option>
                            <option value="BME">BME</option>
                            <option value="BCE">BCE</option>
                            <option value="BEI">BEI</option>
                        </select> */}

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
