import {useForm, useFieldArray} from "react-hook-form"
import {useEffect, useState} from "react"

function Skills() {
    const [allInfo, setAllInfo] = useState({}) //for use with json-server
    const [skills, setSkills] = useState([])
    const {register,
        setValue,
        control,
        handleSubmit, 
    } = useForm({mode: "onBlur"})
    const { fields, append, remove } = useFieldArray({
        control,
        name: "skills"
      });

    const fetchInfo = async () => {
        const res = await fetch("http://localhost:4000/profile")
        const data = await res.json()
        return data
    }
    const onSubmitForm = (data) => {
        let info = allInfo
        info.skills = data
        fetch(`http://localhost:4000/profile`,{
                        method: "PUT",
                        headers: {
                            'Content-type': 'application/json'
                        },
                        body: JSON.stringify(info)
                    })
    }
    useEffect(() => {
        const getInfo = async () => {
            const info = await fetchInfo()
            setAllInfo(info)
            setSkills(info["skills"]["skills"])            
        }
        getInfo()  
    },[])

    useEffect(() => {
        setValue("skills", skills)
    }, [setValue, skills])

    return (
        <div className="container-md ">
            <h3>Skills</h3>
            <div className="m-auto mb-2">
            <form onSubmit={handleSubmit(onSubmitForm)}>
                <div className="skills">
                    {fields.map((item, index) => (
                    <div className="row mb-1" key={item.id}>
                        <div className="col-6 mr-1">
                            <input
                                {...register(`skills.${index}.skill`)}
                                className="form-control"
                                type="text"
                                id="skills"
                                placeholder="Skill"
                                required
                            />
                        </div>
                        <div className="col-4 mr-1">
                            
                            <select
                                {...register(`skills.${index}.proficiency`)}
                                className="form-select"
                                id="skillProficiency"
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
                        
                        <button type="button" className="btn btn-sm btn-danger col-2" onClick={() => remove(index)}>Delete</button>
                    </div>
                    ))}
                </div>
                <div className="d-grid gap-2 m-auto mt-4">
                    <button
                        className="btn btn-secondary btn-md"
                        type="button"
                        onClick={() => append({ skill: "", proficiency: "" })}
                    >
                        Add
                    </button>
                    <button type="submit" className="btn btn-success btn-md">Update</button>
                </div>
            </form>
            </div>
        </div>
    );
}

export default Skills;