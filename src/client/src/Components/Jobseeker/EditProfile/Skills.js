import { useForm, useFieldArray } from 'react-hook-form';
import { useEffect, useState } from 'react';

function Skills() {
  const [allInfo, setAllInfo] = useState({}); //for use with json-server
  const [skills, setSkills] = useState([]);
  const { register, setValue, control, handleSubmit } = useForm({
    mode: 'onBlur',
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'skills',
  });

  const fetchInfo = async () => {
    const res = await fetch('/api/applicant');
    const data = await res.json();
    return data.user;
  };
  const onSubmitForm = (data) => {
    console.log(data);
    fetch(`/api/applicant/skills`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      // TODO: Wut dis?
      body: JSON.stringify(data),
    });
  };
  useEffect(() => {
    const getInfo = async () => {
      const info = await fetchInfo();
      setAllInfo(info);
      setSkills(info.skills);
    };
    getInfo();
  }, []);

  useEffect(() => {
    setValue('skills', skills);
  }, [setValue, skills]);

  return (
    <div>
      <h3>Skills</h3>
      <div className="m-auto mb-2">
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <div className="skills">
            {fields.map((item, index) => (
              <div className="row mb-1" key={item.id}>
                <div className="col-4 mr-1">
                  <input
                    {...register(`skills.${index}.name`)}
                    className="form-control"
                    type="text"
                    id={`name${index}`}
                    placeholder="Skill"
                    required
                  />
                </div>
                <div className="col-4 mr-1">
                  <select
                    {...register(`skills.${index}.proficiency`)}
                    className="form-select"
                    id={`skillProficiency${index}`}
                    required
                  >
                    <option selected disabled value="">
                      Proficiency...
                    </option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
                <div className="col-2 mr-1">
                  <input
                    {...register(`skills.${index}.experience`)}
                    className="form-control"
                    type="number"
                    min="0"
                    id={`skillExperience${index}`}
                    placeholder="Experience"
                    required
                  />
                </div>

                <button
                  type="button"
                  className="btn btn-sm btn-danger col-2"
                  onClick={() => remove(index)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
          <div className="d-grid gap-2 m-auto mt-4">
            <button
              className="btn btn-secondary btn-md"
              type="button"
              onClick={() =>
                append({ skill: '', proficiency: '', experience: '' })
              }
            >
              Add
            </button>
            <button type="submit" className="btn btn-success btn-md">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Skills;
