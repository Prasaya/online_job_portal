import { parse } from 'date-fns';
import { useForm, useFieldArray } from 'react-hook-form';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import District from '../District';
import Education from './Education';
import UserContext from '../../Context/UserContext';

function JobPost() {
  const userCtx = useContext(UserContext);
  const navigate = useNavigate();
  const form = useForm({
    mode: 'onBlur',
    defaultValues: {
      companyId: userCtx.id,
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
    setError,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = form;

  const { fields: skillFields, append: skillAppend } = useFieldArray({
    control,
    name: 'skills',
  });

  const onSubmit = async (data) => {
    const res = await fetch('/api/jobs', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const jsonVal = await res.json();
    if (jsonVal.success) {
      navigate(`/jobs/${jsonVal.jobDetails.jobId}`, { replace: true });
    } else {
      setError('error', { message: jsonVal.message });
    }
  };

  return (
    <div>
      <h1>Post New Job</h1>
      <div className="container bg-light d-flex justify-content-center p-4">
        <form className="col-lg-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label className="form-label" htmlFor="title">
              Job Title
            </label>
            <input
              {...register('title', {
                required: 'Please fill out this field',
                onChange: () => clearErrors(),
              })}
              className={`form-control ${errors.title ? 'is-invalid' : ''}`}
              type="text"
              id="title"
            />
            <div className="invalid-feedback">
              {errors.title && errors.title.message}
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="vacancies">
              Number of Vacancies
            </label>
            <input
              {...register('vacancies', {
                required: 'Please fill out this field',
                onChange: () => clearErrors(),
                pattern: {
                  value: /^[0-9\b]+$/,
                  message: 'Must be a number',
                },
              })}
              className={`form-control ${errors.vacancies ? 'is-invalid' : ''}`}
              type="text"
              id="vacancies"
            />
            <div className="invalid-feedback">
              {errors.vacancies && errors.vacancies.message}
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="description">
              Job Description
            </label>
            <textarea
              {...register('description', {
                required: 'Please fill out this field',
                onChange: () => clearErrors(),
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
            <input
              {...register('deadline', {
                required: 'Please fill out this field',
                onChange: () => clearErrors(),
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
                  onChange: () => clearErrors(),
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
                  onChange: () => clearErrors(),
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
                onChange: () => clearErrors(),
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
          {errors.error && (
            <div className="alert alert-danger my-2">
              {errors.error.message}
            </div>
          )}
          <div className="submit-button">
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
