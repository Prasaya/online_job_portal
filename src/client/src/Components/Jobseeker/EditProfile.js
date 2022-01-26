import { useForm } from "react-hook-form"
import {useState, useEffect} from "react"


function MyProfile() {
    const {register, handleSubmit} = useForm()
    const onSubmitForm = (data) => {

        data.basics.firstname? console.log() :data.basics.firstname = basicInfo.firstname
        data.basics.lastname? console.log() :data.basics.lastname = basicInfo.lastname
        data.basics.email? console.log() :data.basics.email = basicInfo.email
        data.basics.phone? console.log() :data.basics.phone = basicInfo.phone
        data.basics.birthday? console.log() :data.basics.birthday = basicInfo.birthday
        data.basics.faculty? console.log() :data.basics.faculty = basicInfo.faculty


        data.socials.facebook? console.log() :data.socials.facebook = socials.facebook
        data.socials.github? console.log() :data.socials.github = socials.github
        data.socials.twitter? console.log() :data.socials.twitter = socials.twitter
        console.log(skills, data.skills)
        data.skills? console.log() :data.skills = skills

        fetch(`http://localhost:4000/profile`,{
                method: "PUT",
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })

        console.log(data)
    }
    
    const [basicInfo, setBasicInfo] = useState('')
    const [skills, setSkills] = useState('')
    const [socials, setSocials] = useState('')


    const fetchInfo = async () => {
        const res = await fetch("http://localhost:4000/profile")
        const data = await res.json()
        return data
    }
    
    useEffect(() => {
        const getInfo = async () => {
            const info = await fetchInfo()
            setBasicInfo(info["basics"])
            setSkills(info["skills"])
            setSocials(info["socials"])            
        }
        getInfo()        
    }, [])
    return (
        <div className="editprofile">
            <h1>Edit Profile</h1>
            <div className="bg-light container">
                <div className="d-flex justify-content-center">
                    <form className="col-lg-4" action="#" onSubmit={handleSubmit(onSubmitForm)}>
                        <fieldset>
                            <legend>Basic Information</legend>
                            <label htmlFor="basics.firstname">Firstname</label>
                            <input className="form-control form-control-lg my-2" {...register("basics.firstname", {})} type="text" id="firstname" defaultValue={basicInfo["firstname"]}/>
                            
                            <label htmlFor="basics.lastname">Lastname</label>
                            <input className="form-control form-control-lg my-2" {...register("basics.lastname",{})} type="text" id="lastname" defaultValue={basicInfo["lastname"]}/>
                            
                            <label htmlFor="email">Email</label>
                            <input className="form-control form-control-lg my-2" {...register("basics.email",{})} type="email" id="email" defaultValue={basicInfo["email"]}/>
                            
                            <label htmlFor="Phone">Phone</label>
                            <input className="form-control form-control-lg my-2" {...register("basics.phone",{})} type="tel" id="phone" defaultValue={basicInfo["phone"]}/>
                            
                            <label htmlFor="birthday">Birthday</label>
                            <input className="form-control form-control-lg my-2" {...register("basics.birthday",{})} type="date" id="birthday" defaultValue={basicInfo["birthday"]}/>
                            
                            <label htmlFor="faculty">Faculty</label>
                            <select className="form-select form-select-lg my-2" {...register("basics.faculty",{})} id="faculty">
                                <option value="">   </option>
                                <option value="bct">BCT</option>
                                <option value="bme">BME</option>
                                <option value="bce">BCE</option>
                                <option value="bei">BEI</option>
                            </select>
                        </fieldset>
                        <fieldset>
                            <legend>Socials</legend>
                            <label htmlFor="facebook">Facebook</label>
                            <input className="form-control form-control-lg my-2" {...register("socials.facebook",{})} type="text" id="facebook" defaultValue={socials.facebook}/>

                            <label htmlFor="github">Github</label>
                            <input className="form-control form-control-lg my-2" {...register("socials.github",{})} type="text" id="github" defaultValue={socials.github}/>
                            
                            <label htmlFor="twitter">Twitter</label>
                            <input className="form-control form-control-lg my-2" {...register("socials.twitter",{})} type="text" id="twitter" defaultValue={socials.twitter}/>
                        </fieldset>
                        <fieldset>
                            <legend>Skills</legend>
                            <input className="form-control form-control-lg my-2" {...register("skills",{})} type="text" defaultValue={skills}/>
                        </fieldset>
                        <button className="btn btn-primary" type="submit">Save</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default MyProfile;