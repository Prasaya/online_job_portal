import { useState } from 'react';
import { useFieldArray } from 'react-hook-form';

function Education({ form, errors, control }) {
  const { fields: educationFields, append: educationAppend } = useFieldArray({
    control,
    name: 'education',
  });

  const [disciplineOptions, setDisciplineOptions] = useState({});
  const [degreeOptions, setDegreeOptions] = useState();

  const fetchInfo = async (level) => {
    const encodedLevel = encodeURI(`/api/academics?level[]=${level}`);
    console.log(encodedLevel);
    const res = await fetch(encodedLevel);
    return res.json();
  };

  const levelChangeHandler = (e) => {
    const level = e.target.value;
    const getDiscipline = async () => {
      const data = await fetchInfo(level);
      if (data.success) {
        setDisciplineOptions(data.query[level]);
      }
    };
    getDiscipline();
  };

  return (
    <>
      {educationFields.map((item, index) => (
        <div className="row" key={item.id}>
          <div className="col-md-5 mb-3">
            <label className="form-label" htmlFor="educationLevel">
              Education Level
            </label>
            <select
              {...form.register(`education.${index}.level`)}
              className="form-select"
              id={index}
              required
              onChange={levelChangeHandler}
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
          <div className="col-md-7 mb-3">
            <label className="form-label" htmlFor="discipline">
              Discipline
            </label>
            <select
              {...form.register(`education.${index}.discipline`)}
              className="form-select"
              id={index}
              placeholder="Discipline"
              required
            >
              <option selected disabled value="">
                Choose...
              </option>
              {Object.keys(disciplineOptions).map((item) => {
                return <option value={item}>{item}</option>;
              })}
            </select>
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
              {...form.register(`education.${index}.degree`)}
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
            educationAppend({ level: '', discipline: '', degree: '' })
          }
        >
          Add Education
        </button>
      </div>
    </>
  );
}

export default Education;
