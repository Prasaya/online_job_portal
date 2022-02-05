import { useForm } from "react-hook-form";

function JobPost() {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div>
      <h1>Post New Job</h1>
      <div className="container bg-light d-flex justify-content-center">
        <form className="row col-lg-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="col-12 mb-3">
            <label className="form-label" htmlFor="jobTitle">
              Job Title
            </label>
            <input
              {...register("jobTitle")}
              className="form-control"
              type="text"
              id="jobTitle"
              required
            />
          </div>
          <div className="col-12 mb-3">
            <label className="form-label" htmlFor="vacancy">
              Number of Vacancies
            </label>
            <input
              {...register("vacancy")}
              className="form-control"
              type="text"
              id="vacancy"
              required
            />
          </div>
          <div className="col-12 mb-3">
            <label className="form-label" htmlFor="description">
              Job Description
            </label>
            <textarea
              {...register("description")}
              className="form-control"
              id="description"
              rows="3"
              required
            />
          </div>
          <div className="col-12 mb-3">
            <label className="form-label" htmlFor="deadline">
              Deadline
            </label>
            <input
              {...register("deadline")}
              className="form-control"
              type="date"
              id="deadline"
              required
            />
          </div>
          <div className="col-12 mb-3">
            <label className="form-label" htmlFor="experience">
              Work Experience
            </label>
            <input
              {...register("experience")}
              className="form-control"
              type="text"
              id="experience"
              required
            />
          </div>
          <div className="col-5 mb-3">
            <label className="form-label" htmlFor="educationLevel">
              Education Level
            </label>
            <select
              {...register("education.level")}
              className="form-select"
              id="educationLevel"
              required
            >
              <option selected disabled value="">
                Choose...
              </option>
              <option value="Masters">Masters</option>
              <option value="Bachelors">Bachelors</option>
              <option value="Doctorate">Doctorate</option>
              <option value="Diploma">Certificate/Diploma</option>
              <option value="Pre-Diploma">Pre-Diploma</option>
              <option value="Post Graduate Diploma">
                Post Graduate Diploma
              </option>
              <option value="Chartered Accountant">Chartered Accountant</option>
              <option value="Master of Philosophy">Master of Philosophy</option>
            </select>
          </div>
          <div className="col-7 mb-3">
            <label className="form-label" htmlFor="discipline">
              Discipline
            </label>
            <input
              {...register("education.discipline")}
              className="form-control"
              type="text"
              id="discipline"
              list="disciplineOptions"
              required
            />
            <datalist id="disciplineOptions">
              <option value="Agriculture" />
              <option value="Computer Engineering" />
              <option value="Computer and Information Technology" />
              <option value="Engineering" />
            </datalist>
          </div>
          <div className="col-12 mb-3">
            <label className="form-label" htmlFor="degree">
              Degree
            </label>
            <input
              {...register("degree")}
              className="form-control"
              type="text"
              id="degree"
              list="degreeOptions"
              required
            />
            <datalist id="degreeOptions">
              <option value="BSc Computer Science and Information Technology" />
              <option value="Bachelor of Computer Application" />
              <option value="Bachelor of Information Technology" />
              <option value="Bachelor of Software Engineering" />
            </datalist>
          </div>
          <div className="col-8 mb-3">
            <label className="form-label" htmlFor="skills">
              Skills
            </label>
            <input
              {...register("skill.skillName")}
              className="form-control"
              type="text"
              id="skills"
              required
            />
          </div>
          <div className="col-4 mb-3">
            <label className="form-label" htmlFor="skillProficiency">
              Proficiency
            </label>
            <select
              {...register("skill.skillProficiency")}
              className="form-select"
              id="skillProficiency"
            >
              <option selected disabled value="">
                Choose...
              </option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
          </div>
          <div className="">
            <button className="btn btn-primary btn-lg" type="submit">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default JobPost;
