import { useState } from 'react';
import { useFieldArray } from 'react-hook-form';

function Education({ form, errors, control }) {
  const { fields: educationFields, append: educationAppend } = useFieldArray({
    control,
    name: 'education',
  });

  const [disciplineOptions, setDisciplineOptions] = useState([{}]);
  const [degreeOptions, setDegreeOptions] = useState([
    [
      {
        id: '',
        name: '',
      },
    ],
  ]);

  const fetchInfo = async (level) => {
    const encodedLevel = encodeURI(`/api/academics?level[]=${level}`);
    console.log(encodedLevel);
    const res = await fetch(encodedLevel);
    return res.json();
  };

  const levelChangeHandler = (e) => {
    const level = e.target.value;
    const id = parseInt(e.target.id);
    const getDiscipline = async () => {
      const data = await fetchInfo(level);
      if (data.success) {
        setDisciplineOptions((prevOptions) => {
          return prevOptions.map((item, index) => {
            return index === id ? data.query[level] : item;
          });
        });
      }
    };
    getDiscipline();
  };

  const disciplineChangeHandler = (e) => {
    const discipline = e.target.value;
    const id = parseInt(e.target.id);
    setDegreeOptions((prevOptions) => {
      return prevOptions.map((item, index) => {
        return index === id ? disciplineOptions[id][discipline] : item;
      });
    });
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
              onChange={disciplineChangeHandler}
              required
            >
              <option selected disabled value="">
                Choose...
              </option>
              {Object.keys(disciplineOptions[index]).map((item) => {
                return (
                  <option value={item} key={item.id}>
                    {item}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="degree">
              Degree
            </label>
            <select
              {...form.register(`education.${index}.degree`)}
              className="form-select"
              id={index}
              placeholder="Degree"
              required
            >
              <option selected disabled value="">
                Choose...
              </option>
              {degreeOptions[index].map((options) => {
                return (
                  <option value={options.id} key={options.id}>
                    {options.name}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      ))}
      <div className="mb-3">
        <button
          className="btn btn-secondary btn-md"
          type="button"
          onClick={() => {
            educationAppend({ level: '', discipline: '', degree: '' });
            setDisciplineOptions([...disciplineOptions, {}]);
            setDegreeOptions([...degreeOptions, {}]);
          }}
        >
          Add Education
        </button>
      </div>
    </>
  );
}

export default Education;
