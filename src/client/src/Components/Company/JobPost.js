import { useForm, useFieldArray } from "react-hook-form";
import {getUnixTime, parse} from "date-fns";
//todo: fix error message not showing
function JobPost() {
  const { register, control, handleSubmit, formState: { errors }, } = useForm({
    defaultValues: {
      education: [{
        level: "",
        discipline: "",
        degree: "",
      }],
      skills: [{
        skillName: "",
        proficiency: "",
      }]
    },
  });

  const { fields: educationFields, append: educationAppend } = useFieldArray({
    control,
    name: "education",
  });
  const { fields: skillFields, append: skillAppend } = useFieldArray({
    control,
    name: "skills",
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div>
      <h1>Post New Job</h1>
      <div className="container bg-light d-flex justify-content-center">
        <form className="col-md-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
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
          <div className="mb-3">
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
          <div className="mb-3">
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
          <div className="mb-3">
            <label className="form-label" htmlFor="deadline">
              Deadline
            </label>
            <div className="invalid-feedback">
              {errors.deadline && errors.deadline.message}
            </div>
            <input
              {...register("deadline", {required:"Please fill out this field",
                validate: (value) => {
                  const deadline = getUnixTime(parse(value, "yyyy-MM-dd", new Date()))
                  const today = getUnixTime(new Date())
                  if (deadline < today){
                    return "Invalid Deadline"
                  }
                }
              })}
              className={`form-control ${
                errors.deadline ? 'is-invalid' : ''
              }`}
              type="date"
              id="deadline"
            />
          </div>
          <div className="mb-3">
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
          <div className="education">
            {educationFields.map((item, index) => (
              <div className="row" key={item.id}>
                <div className="col-md-5 mb-3">
                  <label className="form-label" htmlFor="educationLevel">
                    Education Level
                  </label>
                  <select
                    {...register(`education.${index}.level`)}
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
                    <option value="Chartered Accountant">
                      Chartered Accountant
                    </option>
                    <option value="Master of Philosophy">
                      Master of Philosophy
                    </option>
                  </select>
                </div>
                <div className="col-md-7 mb-3">
                  <label className="form-label" htmlFor="discipline">
                    Discipline
                  </label>
                  <input
                    {...register(`education.${index}.discipline`)}
                    className="form-control"
                    type="text"
                    id="discipline"
                    list="disciplineOptions"
                    placeholder="Discipline"
                    required
                  />
                  <datalist id="disciplineOptions">
                    <option value="Agriculture" />
                    <option value="Computer Engineering" />
                    <option value="Computer and Information Technology" />
                    <option value="Engineering" />
                  </datalist>
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="degree">
                    Degree
                  </label>
                  <input
                    {...register(`education.${index}.degree`)}
                    className="form-control"
                    type="text"
                    id="degree"
                    list="degreeOptions"
                    placeholder="Degree"
                    required
                  />
                  <datalist id="degreeOptions">
                    <option value="BSc Computer Science and Information Technology" />
                    <option value="Bachelor of Computer Application" />
                    <option value="Bachelor of Information Technology" />
                    <option value="Bachelor of Software Engineering" />
                  </datalist>
                </div>
              </div>
            ))}
            <div className="mb-3">
              <button
                className="btn btn-secondary btn-md"
                type="button"
                onClick={() =>
                  educationAppend({ level: "", discipline: "", degree: "" })
                }
              >
                Add Education
              </button>
            </div>
          </div>
          <div className="skills">
            {skillFields.map((item, index) => (
              <div className="row" key={item.id}>
                <div className="col-8 mb-3">
                  <label className="form-label" htmlFor="skills">
                    Skills
                  </label>
                  <input
                    {...register(`skills.${index}.skillName`)}
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
                    {...register(`skills.${index}.proficiency`)}
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
              </div>
            ))}
            <div className="mb-3">
              <button
                className="btn btn-secondary btn-md"
                type="button"
                onClick={() => skillAppend({ skillName: "", proficiency: "" })}
              >
                Add Skill
              </button>
            </div>
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
