import { useForm } from "react-hook-form";

function RegisterCompany() {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

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
                {...register("name")}
                type="text"
                className="form-control form-control-lg"
                placeholder="Company Name"
                id="companyName"
                required
              />
              <label htmlFor="companyName">Company Name</label>
            </div>
            <div className="form-floating mb-3">
              <input
                {...register("email")}
                type="email"
                className="form-control form-control-lg"
                placeholder="Company Name"
                id="companyName"
                required
              />
              <label htmlFor="companyEmail">Company Email</label>
            </div>
            <div className="form-floating mb-3">
              <input
                {...register("phoneNumber")}
                type="tel"
                className="form-control form-control-lg"
                placeholder="Phone Number"
                id="companyName"
                required
              />
              <label htmlFor="phoneNumber">Phone Number</label>
            </div>
            <div className="form-floating mb-3">
              <input
                {...register("password")}
                type="password"
                className="form-control form-control-lg"
                placeholder="Password"
                id="companyPassword"
                required
              />
              <label htmlFor="companyPassword">Password</label>
            </div>
            <div className="form-floating mb-3">
              <input
                {...register("website")}
                type="url"
                className="form-control form-control-lg"
                placeholder="Website"
                id="website"
                required
              />
              <label htmlFor="website">Website</label>
            </div>
            <div className="form-floating mb-3">
              <input
                {...register("address")}
                type="text"
                className="form-control form-control-lg"
                placeholder="Address"
                id="address"
                required
              />
              <label htmlFor="address">Address</label>
            </div>
            <div className="form-floating mb-3">
              <select
                {...register("district")}
                className="form-select"
                id="district"
                defaultValue="choose"
                required
              >
                <option selected disabled value="choose">
                  Choose...
                </option>
                <option value="bhaktapur">Bhaktapur</option>
                <option value="kathmandu">Kathmandu</option>
                <option value="lalitpur">Lalitpur</option>
              </select>
              <label htmlFor="district">District</label>
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

export default RegisterCompany;
