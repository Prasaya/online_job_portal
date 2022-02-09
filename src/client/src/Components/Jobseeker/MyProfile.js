import {useState, useEffect} from "react"
import { Link } from "react-router-dom";
function titleCase(str) {
    return str.toLowerCase().split(' ').map(function(word) {
      return word.replace(word[0], word[0].toUpperCase());
    }).join(' ');
}
function MyProfile() {
    const [basicInfo, setBasicInfo] = useState({})
    const [skills, setSkills] = useState({})
    const [education, setEducation] = useState([])
    const [picture, setPicture] = useState("")
    let basicEntries = []
    let skillsEntries = []

    const fetchInfo = async () => {
        const res = await fetch("http://localhost:4000/profile")
        const data = await res.json()
        console.log(data)
        console.log(res)
        return data
    }
    
    useEffect(() => {
        const getInfo = async () => {
            const info = await fetchInfo()
            setBasicInfo(info["basics"])
            setSkills(info["skills"])
            setEducation(info["education"])   
            setPicture(info["picture"])         
        }
        getInfo()
        
    }, [])
    basicEntries = Object.entries(basicInfo)
    skillsEntries = Object.entries(skills)
    return ( 
        <div className="myprofile">
            <h1>My Profile <span><Link className="btn btn-secondary" to="/jobseeker/editprofile">Edit</Link></span></h1>
            <div className="container bg-light profile">
                <div className="row">
                    <div className="col-2">
                        <img className="img-fluid img-thumbnail rounded float-start" src={picture || "http://stock.wikimini.org/w/images/9/95/Gnome-stock_person-avatar-profile.png"} alt="profile pic" />
                    </div>
                    <div className="col-10">
                        <div className="row">
                            <div className="basic col-lg-6">
                                <h3>Basic information</h3>
                                <table className="table">
                                    <tbody>
                                        {basicEntries.map((entry) => {
                                            return (
                                                <>
                                                    {entry[1] && 
                                                    <tr>
                                                        <td>{titleCase(entry[0])}</td>
                                                        <td>:</td>
                                                        <td>{entry[1]}</td>
                                                     </tr>}
                                                </>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            <div className="education col-lg-6">
                                <h3>Education</h3>
                                <table className="table">
                                    <tbody>
                                        {education.map((entry)=>{
                                            return(
                                                <>
                                                    <tr>
                                                        <td>Level</td>
                                                        <td>:</td>
                                                        <td>{titleCase(entry["level"])}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Discipline</td>
                                                        <td>:</td>
                                                        <td>{titleCase(entry["discipline"])}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Degree</td>
                                                        <td>:</td>
                                                        <td>{titleCase(entry["degree"])}</td>
                                                    </tr>
                                                </>
                                                
                                                
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="row">
                            <div className="skills col-6">
                                <h3>Skills</h3>
                                <table className="table">
                                    <tbody>
                                        {skillsEntries.map((entry) => {
                                            return (
                                                <tr>
                                                    <td>{titleCase(entry[0])}</td>
                                                    <td>:</td>
                                                    <td>{entry[1]}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>    
    );
}

export default MyProfile;