import { useForm, useFieldArray } from 'react-hook-form';
import { useState, useEffect } from 'react';

function Education() {
  const [education, setEducation] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [academics, setAcademics] = useState({ success: false });
  const [disciplineOptions, setDisciplineOptions] = useState([{}]);
  const [degreeOptions, setDegreeOptions] = useState([[{}]]);
  const [qId, setqId] = useState([]);
  const [isUpdateSuccess, setIsUpdateSuccess] = useState(false);
  const [isUpdateFail, setIsUpdateFail] = useState(false);

  const { register, setValue, control, handleSubmit } = useForm({
    mode: 'onBlur',
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'academics',
  });

  const fetchInfo = async () => {
    const res = await fetch('/api/applicant');
    const data = await res.json();
    return data;
  };
  const onSubmitForm = async (data) => {
    data.academics.map((item) => {
      setqId((prev) => {
        return [...prev, item.qid];
      });
    });
    const uniqueQid = qId.filter((i, index) => {
      return qId.indexOf(i) === index;
    });
    setqId(uniqueQid);
    data.academics = qId;

    const res = await fetch(`/api/applicant/academics`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (res.status === 200) {
      setIsUpdateSuccess(true);
    } else {
      setIsUpdateFail(true);
    }
    const info = await res.json();
    console.log(info);
  };

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
    if (fields.length <= education.length) {
      setValue('academics', education);
    }
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
              <div className="row my-2" key={item.id}>
                <div className="col-lg-3 mb-1">
                  <select
                    {...register(`academics.${index}.level`)}
                    className="form-select"
                    id={index}
                    onChange={levelChangeHandler}
                    required
                    defaultValue=""
                  >
                    <option disabled value="">
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
                <div className="col-lg-3 mb-1">
                  <select
                    {...register(`academics.${index}.discipline`)}
                    className="form-select"
                    id={index}
                    required
                    onChange={disciplineChangeHandler}
                    defaultValue=""
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
                <div className="col-lg-4 mb-1">
                  <select
                    {...register(`academics.${index}.degree`)}
                    className="form-select"
                    id={index}
                    required
                    defaultValue=""
                  >
                    <option disabled value="">
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
                <div className="col-lg-2 mb-1">
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => {
                      remove(index);
                      setIsUpdateFail(false);
                      setIsUpdateSuccess(false);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="message text-center mt-2">
            {isUpdateSuccess && (
              <p className="text-success">Updated Successfully</p>
            )}
            {isUpdateFail && <p className="text-danger">Update Failed</p>}
          </div>
          <div className="d-grid gap-2 m-auto mt-2">
            <button
              className="btn btn-secondary btn-md"
              type="button"
              onClick={() => {
                append({ degree: '', discipline: '', level: '' });
                setDisciplineOptions([...disciplineOptions, {}]);
                setDegreeOptions([...degreeOptions, [{}]]);
                setIsUpdateFail(false);
                setIsUpdateSuccess(false);
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
