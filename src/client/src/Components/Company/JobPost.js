import { parse } from 'date-fns';
import { useForm, useFieldArray } from 'react-hook-form';
import District from '../District';
import Education from './Education';

function JobPost() {
  const form = useForm({
    mode: 'onBlur',
    defaultValues: {
      education: [
        {
          level: '',
          discipline: '',
          degree: '',
        },
      ],
      skills: [
        {
          skillName: '',
          proficiency: '',
        },
      ],
    },
  });
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  const { fields: skillFields, append: skillAppend } = useFieldArray({
    control,
    name: 'skills',
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div>
      <h1>Post New Job</h1>
      <div className="container bg-light d-flex justify-content-center p-4">
        <form className="col-lg-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label className="form-label" htmlFor="jobTitle">
              Job Title
            </label>
            <input
              {...register('jobTitle', {
                required: 'Please fill out this field',
              })}
              className={`form-control ${errors.jobTitle ? 'is-invalid' : ''}`}
              type="text"
              id="jobTitle"
            />
            <div className="invalid-feedback">
              {errors.jobTitle && errors.jobTitle.message}
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="vacancy">
              Number of Vacancies
            </label>
            <input
              {...register('vacancy', {
                required: 'Please fill out this field',
                pattern: {
                  value: /^[0-9\b]+$/,
                  message: 'Must be a number',
                },
              })}
              className={`form-control ${errors.vacancy ? 'is-invalid' : ''}`}
              type="text"
              id="vacancy"
            />
            <div className="invalid-feedback">
              {errors.vacancy && errors.vacancy.message}
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="description">
              Job Description
            </label>
            <textarea
              {...register('description', {
                required: 'Please fill out this field',
              })}
              className={`form-control ${
                errors.description ? 'is-invalid' : ''
              }`}
              id="description"
              rows="3"
            />
            <div className="invalid-feedback">
              {errors.description && errors.description.message}
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="deadline">
              Deadline
            </label>
            <div className="invalid-feedback">
              {errors.deadline && errors.deadline.message}
            </div>
            <input
              {...register('deadline', {
                required: 'Please fill out this field',
                validate: (value) => {
                  const deadline = parse(value, 'yyyy-MM-dd', new Date());
                  const today = new Date();
                  if (deadline < today) {
                    return 'Invalid Deadline';
                  }
                },
              })}
              className={`form-control ${errors.deadline ? 'is-invalid' : ''}`}
              type="date"
              id="deadline"
            />
            <div className="invalid-feedback">
              {errors.deadline && errors.deadline.message}
            </div>
          </div>
          <div className="address row">
            <div className="mb-3 col-md-8">
              <label htmlFor="address" className="form-label">
                Address
              </label>
              <input
                {...register('address', {
                  required: 'Please fill out this field',
                })}
                type="text"
                className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                placeholder="Address"
                id="address"
              />
              <div className="invalid-feedback">
                {errors.address && errors.address.message}
              </div>
            </div>
            <div className="mb-3 col-md-4">
              <label htmlFor="district" className="form-label">
                District
              </label>
              <select
                {...form.register('district', {
                  required: 'Please choose a valid option',
                })}
                className={`form-select ${errors.district ? 'is-invalid' : ''}`}
                id="district"
              >
                <District />
              </select>
              <div className="invalid-feedback">
                {errors.district && errors.district.message}
              </div>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="experience">
              Work Experience
            </label>
            <input
              {...register('experience', {
                required: 'Please fill out this field',
              })}
              className={`form-control ${
                errors.experience ? 'is-invalid' : ''
              }`}
              type="text"
              id="experience"
              required
            />
            <div className="invalid-feedback">
              {errors.experience && errors.experience.message}
            </div>
          </div>
          <div className="education">
            <Education form={form} errors={errors} control={control} />
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
                onClick={() => skillAppend({ skillName: '', proficiency: '' })}
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
