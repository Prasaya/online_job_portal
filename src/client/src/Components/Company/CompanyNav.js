import { Link } from "react-router-dom"
import {useState} from "react"

function CompanyNav(){
    const [navElements, setNavElements] = useState([
        {
            name: "Overview",
            to:"overview",
            status: "active" 
        },
        {
            name: "Profile",
            to:"profile",
            status: ""
        },
        {
            name: "Settings",
            to: "settings",
            status: ""
        }]
    )
    function OnClick(e){
        const id = e.target.id
        const updatedNavElements = navElements.map((element) => {
            if (element.status === "active"){
                element.status = ""
            }
            if (element.to === id){
                element.status = "active"
            }
            return element
        })
        setNavElements(updatedNavElements)
    }

    return(
        <nav className="navbar navbar-expand-lg navbar-light bg-light py-2">
            <div className="container d-flex flex-row justify-content-between">
                <Link className="navbar-brand left" to="/">Job Portal</Link>
                <div className="right">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            {navElements.map((element) => {
                                return(
                                    <li className="nav-link">
                                        <Link onClick={OnClick} className={`nav-link ${element.status}`} to={element.to} id={`${element.to}`}>{element.name}</Link>
                                    </li>
                                )
                            })}
                        </ul>
                </div>
            </div>
        </nav>
    )
}

export default CompanyNav
