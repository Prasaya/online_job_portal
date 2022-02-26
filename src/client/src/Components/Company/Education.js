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

  const [isCheckAll, setIsCheckAll] = useState([false]);
  const [isCheck, setIsCheck] = useState([[]]);

  function handleSelectAll(index) {
    setIsCheckAll((prevChecks) => {
      return prevChecks.map((check, i) => {
        return index === i ? !check : check;
      });
    });
    setIsCheck((prevChecks) => {
      return prevChecks.map((check, i) => {
        return index === i ? degreeOptions[index].map((li) => li.id) : check;
      });
    });
    if (isCheckAll[index]) {
      setIsCheck((prevChecks) => {
        return prevChecks.map((check, i) => {
          return index === i ? [] : check;
        });
      });
    }
  }

  const handleClick = (e, index) => {
    const { checked } = e.target;
    const id = parseInt(e.target.id);
    setIsCheck((prevChecks) => {
      return prevChecks.map((check, i) => {
        return index === i ? [...check, id] : check;
      });
    });
    setIsCheckAll((prevChecks) => {
      return prevChecks.map((check, i) => {
        return index === i ? false : check;
      });
    });
    if (!checked) {
      setIsCheck((prevChecks) => {
        return prevChecks.map((check, i) => {
          return index === i ? check.filter((item) => item !== id) : check;
        });
      });
    }
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
                if (item === 'ALL_DISCIPLINES') {
                  return (
                    <option value={item} key={item.id}>
                      Any Discipline
                    </option>
                  );
                }
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
            {degreeOptions[index].map((options) => {
              if (options.name === 'ALL_DEGREES') {
                return (
                  <div className="form-check" key={options.id}>
                    <input
                      {...form.register(`qualifications`)}
                      type="checkbox"
                      id={options.id}
                      value={options.id}
                      className="form-check-input"
                      onClick={() => handleSelectAll(index)}
                      checked={isCheckAll[index]}
                    />
                    <label className="form-check-label">
                      Select/Unselect All
                    </label>
                  </div>
                );
              }
            })}
            {degreeOptions[index].map((options) => {
              if (options.name === 'ALL_DEGREES') {
                return <></>;
              }
              return (
                <div className="form-check" key={options.id}>
                  <input
                    {...form.register(`qualifications`)}
                    type="checkbox"
                    id={options.id}
                    value={options.id}
                    className="form-check-input"
                    onClick={(e) => handleClick(e, index)}
                    checked={isCheck[index].includes(options.id)}
                  />
                  <label className="form-check-label">{options.name}</label>
                </div>
              );
            })}
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
            setDegreeOptions([...degreeOptions, [{}]]);
            setIsCheck([...isCheck, []]);
            setIsCheckAll([...isCheckAll, false]);
          }}
        >
          Add Education
        </button>
      </div>
    </>
  );
}

export default Education;
