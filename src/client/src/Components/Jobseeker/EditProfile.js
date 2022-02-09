import {useState, useEffect} from "react"
import {Link, useLocation, Outlet} from "react-router-dom"


function MyProfile() {
    const path = useLocation().pathname
    const [navElements, setNavElements] = useState([
        {
            name: "Avatar",
            to:"avatar",
            status: "" 
        },
        {
            name: "Basic Info",
            to:"basics",
            status: ""
        },
        {
            name: "Education",
            to:"education",
            status: ""
        },
        {
            name: "Skills",
            to: "skills",
            status: ""
        }]
    )
    function OnClick(e){
        const id = e.target.id
        const updatedNavElements = navElements.map((element) => {
            if (element.status === "table-active"){
                element.status = ""
            }
            if (element.to === id){
                element.status = "table-active"
            }
            return element
        })
        setNavElements(updatedNavElements)
    }
    //set active for initial render
    useEffect(() => {
        const updatedNavElements = navElements.map((element) => {
            if (element.status === "table-active"){
                element.status = ""
            }
            if (path.includes(element.to) ){
                element.status = "table-active"
            }
            return element
        })
        setNavElements(updatedNavElements)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // const {register, handleSubmit} = useForm()
    // const onSubmitForm = (data) => {

    //     data.basics.firstname? console.log() :data.basics.firstname = basicInfo.firstname
    //     data.basics.lastname? console.log() :data.basics.lastname = basicInfo.lastname
    //     data.basics.email? console.log() :data.basics.email = basicInfo.email
    //     data.basics.phone? console.log() :data.basics.phone = basicInfo.phone
    //     data.basics.birthday? console.log() :data.basics.birthday = basicInfo.birthday
    //     data.basics.faculty? console.log() :data.basics.faculty = basicInfo.faculty


    //     data.socials.facebook? console.log() :data.socials.facebook = socials.facebook
    //     data.socials.github? console.log() :data.socials.github = socials.github
    //     data.socials.twitter? console.log() :data.socials.twitter = socials.twitter
    //     data.skills? console.log() :data.skills = skills

    //     fetch(`/api/user/uid`,{
    //             method: "PUT",
    //             headers: {
    //                 'Content-type': 'application/json'
    //             },
    //             body: JSON.stringify(data)
    //         })

    //     console.log(data)
    // }
    
    // const [basicInfo, setBasicInfo] = useState('')
    // const [skills, setSkills] = useState('')
    // const [socials, setSocials] = useState('')


    // const fetchInfo = async () => {
    //     const res = await fetch("http://localhost:4000/profile")
    //     const data = await res.json()
    //     return data
    // }
    
    // useEffect(() => {
    //     const getInfo = async () => {
    //         const info = await fetchInfo()
    //         setBasicInfo(info["basics"])
    //         setSkills(info["skills"])
    //         setSocials(info["socials"])            
    //     }
    //     getInfo()        
    // }, [])
    return (
        <div className="editprofile">
            <h1>Edit Profile</h1>
            <div className="bg-light container">
                {/* <div className="d-flex justify-content-center">
                    <form className="col-lg-4" action="#" onSubmit={handleSubmit(onSubmitForm)}>
                        <fieldset>
                            <legend>Basic Information</legend>
                            <label htmlFor="firstName">Firstname</label>
                            <input className="form-control form-control-lg my-2" {...register("basics.firstName", {})} type="text" id="firstname" defaultValue={basicInfo["firstName"]}/>
                            
                            <label htmlFor="middleName">Middlename</label>
                            <input className="form-control form-control-lg my-2" {...register("basics.middleName", {})} type="text" id="middleName" defaultValue={basicInfo["middleName"]}/>
                            
                            <label htmlFor="lastName">Lastname</label>
                            <input className="form-control form-control-lg my-2" {...register("basics.lastName",{})} type="text" id="lastName" defaultValue={basicInfo["lastName"]}/>
                            
                            <label htmlFor="email">Email</label>
                            <input className="form-control form-control-lg my-2" {...register("basics.email",{disabled:true})} type="email" id="email" defaultValue={basicInfo["email"]}/>
                            
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
                </div> */}
                <div className="row">
                    <div className="col-12 col-lg-3">
                        <table className="table table-hover">
                            <tbody>
                                {navElements.map((element) => {
                                    return(
                                        <tr className="">
                                            <Link onClick={OnClick} className={`nav-link ${element.status}`} to={element.to} id={`${element.to}`}>{element.name}</Link>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className="col-12 col-lg-9">
                        <Outlet/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyProfile;