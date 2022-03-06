import { useForm, useFieldArray } from 'react-hook-form';
import { useState, useEffect } from 'react';

function Education() {
  const [allInfo, setAllInfo] = useState({}); //for use with json-server
  const [education, setEducation] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [academics, setAcademics] = useState({ success: false });

  const { register, getValues, setValue, watch, reset, control, handleSubmit } =
    useForm({ mode: 'onBlur' });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'education',
  });

  const watchFieldArray = watch('education');
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index],
    };
  });

  const fetchInfo = async () => {
    const res = await fetch('/api/applicant');
    const data = await res.json();
    return data;
  };
  const onSubmitForm = (data) => {
    // let info = allInfo
    // info.education = data
    // fetch(`http://localhost:4000/profile`,{
    //                 method: "PUT",
    //                 headers: {
    //                     'Content-type': 'application/json'
    //                 },
    //                 body: JSON.stringify(info)
    //             })
  };

  const [disciplineOptions, setDisciplineOptions] = useState([{}]);
  const [degreeOptions, setDegreeOptions] = useState([[{}]]);

  const fetchAllAcademics = async () => {
    const res = await fetch('/api/academics');
    return res.json();
  };

  function changeDisciplineOptions(level, id) {
    setDisciplineOptions((prevOptions) => {
      return prevOptions.map((item, index) => {
        return index === id ? academics.query[level] : item;
      });
    });
  }

  const levelChangeHandler = (e) => {
    const level = e.target.value;
    const id = parseInt(e.target.id);
    changeDisciplineOptions(level, id);
  };

  function changeDegreeOptions(discipline, id) {
    setDegreeOptions((prevOptions) => {
      return prevOptions.map((item, index) => {
        return index === id ? disciplineOptions[id][discipline] : item;
      });
    });
  }

  const disciplineChangeHandler = (e) => {
    const discipline = e.target.value;
    const id = parseInt(e.target.id);
    changeDegreeOptions(discipline, id);
  };

  useEffect(() => {
    (async () => {
      const info = await fetchAllAcademics();
      setAcademics(info);
    })();
    const getInfo = async () => {
      const info = await fetchInfo();
      if (info.success) {
      }
      setAllInfo(info);
      setEducation(info.user.academics);
      setLoading(false);
    };
    getInfo();
  }, []);

  useEffect(() => {
    if (academics.success) {
      education.map((options, index) => {
        if (disciplineOptions.length - 1 < index) {
          setDisciplineOptions((prevOptions) => {
            return [...prevOptions, academics.query[options.level]];
          });
        } else {
          changeDisciplineOptions(options.level, index);
        }
      });
    }
  }, [isLoading]);

  useEffect(() => {
    education.map((options, index) => {
      if (degreeOptions.length - 1 < index) {
        setDegreeOptions((prevOptions) => {
          return [...prevOptions, disciplineOptions[index][options.discipline]];
        });
      } else {
        changeDegreeOptions(options.discipline, index);
      }
    });
  }, [disciplineOptions]);

  useEffect(() => {
    setValue('education', education);
  }, [degreeOptions]);

  if (isLoading) {
    return <>Loading...</>;
  }

  return (
    <div className="p-2">
      <h3>Education</h3>
      <div className="p-1 my-2">
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <div className="education">
            {fields.map((item, index) => (
              <div className="row mb-1" key={item.id}>
                <div className="col-3 mr-1">
                  <select
                    {...register(`education.${index}.level`)}
                    className="form-select"
                    id={index}
                    onChange={levelChangeHandler}
                    required
                  >
                    <option selected disabled value="">
                      Education Level...
                    </option>
                    <option value="Bachelors">Bachelors</option>
                    <option value="Certificate/Diploma">
                      Certificate/Diploma
                    </option>
                    <option value="Chartered Acoountant (CA)">
                      Chartered Acoountant (CA)
                    </option>
                    <option value="Doctorate">Doctorate</option>
                    <option value="Master of Philosophy">
                      Master of Philosophy
                    </option>
                    <option value="Masters">Masters</option>
                    <option value="Post Graduate Diploma">
                      Post Graduate Diploma
                    </option>
                    <option value="Pre-Diploma">Pre-Diploma</option>
                  </select>
                </div>
                <div className="col-3 mr-1">
                  <select
                    {...register(`education.${index}.discipline`)}
                    className="form-select"
                    id={index}
                    required
                    onChange={disciplineChangeHandler}
                  >
                    <option disabled value="">
                      Discipline...
                    </option>
                    {Object.keys(disciplineOptions[index]).map((item) => {
                      if (item === 'ALL_DISCIPLINES') {
                        return <></>;
                      }
                      return (
                        <option value={item} key={item.id}>
                          {item}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="col-4 mr-1">
                  <select
                    {...register(`education.${index}.degree`)}
                    className="form-select"
                    id={index}
                    required
                  >
                    <option selected disabled value="">
                      Degree...
                    </option>
                    {degreeOptions[index].map((options) => {
                      if (options.name === 'ALL_DEGREES') {
                        return <></>;
                      }
                      return (
                        <option value={options.name} key={options.id}>
                          {options.name}
                        </option>
                      );
                    })}
                  </select>
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
              onClick={() => {
                append({ degree: '', discipline: '', level: '' });
                setDisciplineOptions([...disciplineOptions, {}]);
                setDegreeOptions([...degreeOptions, [{}]]);
              }}
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

export default Education;
