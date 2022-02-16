import {useForm, useFieldArray} from "react-hook-form"
import {useEffect, useState} from "react"
function Education() {
    const [allInfo, setAllInfo] = useState({}) //for use with json-server
    const [education, setEducation] = useState([])
    const {register,
        getValues,
        setValue,
        watch,
        reset,
        control,
        handleSubmit, 
    } = useForm({mode: "onBlur"})
    const { fields, append, remove } = useFieldArray({
        control,
        name: "education"
      });
    
    const watchFieldArray = watch("education")
    const controlledFields = fields.map((field, index) => {
        return {
          ...field,
          ...watchFieldArray[index]
        }
    })

    const fetchInfo = async () => {
        const res = await fetch("http://localhost:4000/profile")
        const data = await res.json()
        return data
    }
    const onSubmitForm = (data) => {
        console.log(data)
        // let info = allInfo
        // info.education = data
        // fetch(`http://localhost:4000/profile`,{
        //                 method: "PUT",
        //                 headers: {
        //                     'Content-type': 'application/json'
        //                 },
        //                 body: JSON.stringify(info)
        //             })
    }
    // useEffect(() => {
    //     const getInfo = async () => {
    //         const info = await fetchInfo()
    //         setAllInfo(info)
    //         setEducation(info["education"])            
    //     }
    //     getInfo()  
    // },[])

    // useEffect(() => {
    //     setValue("education", education)
    // }, [setValue, education])

    return (
        <>
            <h1>Education</h1>
            <div className="m-auto mb-2">
                <form onSubmit={handleSubmit(onSubmitForm)}>
                    <div className="education">
                        {controlledFields.map((item, index) => (
                        <div className="row mb-1" key={item.id}>
                            <div className="col-3 mr-1">
                                <select
                                    {...register(`education.${index}.level`)}
                                    className="form-select"
                                    id={`education.${index}.level`}
                                    onChange={e => {
                                        const discipline = document.getElementById(`education.${index}.discipline`)
                                        const degree = document.getElementById(`education.${index}.degree`)
                                        degree.disabled = true
                                        degree.value = ""
                                        discipline.value = ""
                                        discipline.disabled = false
                                        
                                    }}
                                    required
                                >
                                    <option selected disabled value="">
                                        Education Level...
                                    </option>
                                    <option value="Bachelors">Bachelors</option>
                                    <option value="Certificate/Diploma">Certificate/Diploma</option>
                                    <option value="Chartered Acoountant (CA)">Chartered Acoountant (CA)</option>
                                    <option value="Doctorate">Doctorate</option>
                                    <option value="Master of Philosophy">Master of Philosophy</option>
                                    <option value="Masters">Masters</option>
                                    <option value="Post Graduate Diploma">Post Graduate Diploma</option>
                                    <option value="Pre-Diploma">Pre-Diploma</option>
                                    <option value="Primary/Secondary">Primary/Secondary</option>
                                </select>
                            </div>
                            <div className="col-3 mr-1">
                                <select
                                    {...register(`education.${index}.discipline`)}
                                    className="form-select"
                                    id={`education.${index}.discipline`}
                                    disabled={true}
                                    required
                                    onChange={e => {
                                        const degree = document.getElementById(`education.${index}.degree`)
                                        degree.value = ""
                                        degree.disabled = false
                                    }}
                                >
                                    <option selected disabled value="">
                                        Discipline...
                                    </option>
                                    <option value="Bachelors">Bachelors</option>
                                    <option value="Certificate/Diploma">Certificate/Diploma</option>
                                    <option value="Chartered Acoountant (CA)">Chartered Acoountant (CA)</option>
                                    <option value="Doctorate">Doctorate</option>
                                    <option value="Master of Philosophy">Master of Philosophy</option>
                                    <option value="Masters">Masters</option>
                                    <option value="Post Graduate Diploma">Post Graduate Diploma</option>
                                    <option value="Pre-Diploma">Pre-Diploma</option>
                                    <option value="Primary/Secondary">Primary/Secondary</option>
                                </select>
                            </div>
                            <div className="col-4 mr-1">
                                <select
                                    {...register(`education.${index}.degree`)}
                                    className="form-select"
                                    id={`education.${index}.degree`}
                                    disabled={true}
                                    required
                                >
                                    <option selected disabled value="">
                                        Degree...
                                    </option>
                                    <option value="Bachelors">Bachelors</option>
                                    <option value="Certificate/Diploma">Certificate/Diploma</option>
                                    <option value="Chartered Acoountant (CA)">Chartered Acoountant (CA)</option>
                                    <option value="Doctorate">Doctorate</option>
                                    <option value="Master of Philosophy">Master of Philosophy</option>
                                    <option value="Masters">Masters</option>
                                    <option value="Post Graduate Diploma">Post Graduate Diploma</option>
                                    <option value="Pre-Diploma">Pre-Diploma</option>
                                    <option value="Primary/Secondary">Primary/Secondary</option>
                                </select>
                            </div>
                            
                            <button type="button" className="btn btn-sm btn-danger col-2" onClick={() => remove(index)}>Delete</button>
                        </div>
                        ))}
                    </div>
                    <div className="d-grid gap-2 m-auto mt-4">
                        <button
                            className="btn btn-secondary btn-md"
                            type="button"
                            onClick={() => append({ degree: "", discipline:"", level: "" })}
                        >
                            Add
                        </button>
                        <button type="submit" className="btn btn-success btn-md">Update</button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default Education;