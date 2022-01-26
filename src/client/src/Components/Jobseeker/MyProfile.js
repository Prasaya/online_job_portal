import {useState, useEffect} from "react"
import { Link } from "react-router-dom";
function titleCase(str) {
    return str.toLowerCase().split(' ').map(function(word) {
      return word.replace(word[0], word[0].toUpperCase());
    }).join(' ');
}
function MyProfile() {
    const [basicInfo, setBasicInfo] = useState('')
    const [skills, setSkills] = useState('')
    const [socials, setSocials] = useState('')
    let basicEntries = []
    let skillsEntries = []
    let socialsEntries = []

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
    basicEntries = Object.entries(basicInfo)
    socialsEntries = Object.entries(socials)
    skillsEntries = skills.split(",")
    return ( 
        <div className="myprofile">
            <h1>My Profile <span><Link className="btn btn-secondary" to="/jobseeker/editprofile">Edit</Link></span></h1>
            <div className="container bg-light profile">
                <div className="row">
                    <div className="col-4">
                        <img src="#" alt="profile pic" />
                    </div>
                    <div className="col-8">
                        <div className="row">
                            <div className="basic col-6">
                                <h3>Basic information</h3>
                                <table className="table">
                                    <tbody>
                                        {basicEntries.map((entry) => {
                                            return (
                                                <tr>
                                                    <td>{titleCase(entry[0])}</td>
                                                    <td>{entry[1]}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            <div className="socials col-6">
                                <h3>Socials</h3>
                                <table className="table">
                                    <tbody>
                                        {socialsEntries.map((entry) => {
                                            return (
                                                <tr>
                                                    <td>{titleCase(entry[0])}</td>
                                                    <td><a href={entry[1]}>{entry[1]}</a></td>
                                                </tr>
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
                                        {skillsEntries.map((skill) => {
                                            return (
                                                <tr>
                                                    <td>{skill}</td>
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