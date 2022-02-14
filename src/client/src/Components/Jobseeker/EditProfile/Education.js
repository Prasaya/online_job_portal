import {useForm, useFieldArray} from "react-hook-form"
import {useEffect, useState} from "react"
function Education() {
    const [allInfo, setAllInfo] = useState({}) //for use with json-server
    const [education, setEducation] = useState([])
    const {register,
        getValues,
        setValue,
        control,
        handleSubmit, 
    } = useForm({mode: "onBlur"})
    const { fields, append, remove } = useFieldArray({
        control,
        name: "education"
      });

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
    //         setEducation(info["education"]["education"])            
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
                <form onSubmit={handleSubmit(data => console.log(data))}>
                    <div className="education">
                        {fields.map((item, index) => (
                        <div className="row mb-1" key={item.id}>
                            <div className="col-6 mr-1">
                                <select
                                    {...register(`education.${index}.level`)}
                                    className="form-select"
                                    id="educationLevel"
                                    required
                                >
                                    <option selected disabled value="">
                                        Education Level...
                                    </option>
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                    <option value="Expert">Expert</option>
                                </select>
                            </div>
                            <div className="col-4 mr-1">
                                <input
                                    {...register(`education.${index}.skill`)}
                                    className="form-control"
                                    type="text"
                                    id="education"
                                    placeholder="Skill"
                                    required
                                />
                            </div>
                            
                            <button type="button" className="btn btn-sm btn-danger col-2" onClick={() => remove(index)}>Delete</button>
                        </div>
                        ))}
                    </div>
                    <div className="d-grid gap-2 m-auto mt-4">
                        <button
                            className="btn btn-secondary btn-md"
                            type="button"
                            onClick={() => append({ skill: "", level: "" })}
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