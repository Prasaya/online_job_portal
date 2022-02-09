import { Link, useLocation } from "react-router-dom"
import {useState, useEffect} from "react"

function Nav(){
    const path = useLocation().pathname
    const [navElements, setNavElements] = useState([
        {
            name: "Overview",
            to:"overview",
            status: "" 
        },
        {
            name: "My Status",
            to:"mystatus",
            status: ""
        },
        {
            name: "My Profile",
            to:"myprofile",
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
    //set active for initial render
    useEffect(() => {
        const updatedNavElements = navElements.map((element) => {
            if (element.status === "active"){
                element.status = ""
            }
            if (path.includes(element.to) ){
                element.status = "active"
            }
            return element
        })
        setNavElements(updatedNavElements)
    }, []);

    return(
        <nav className="navbar navbar-expand-lg navbar-light bg-light py-2">
            <div className="container-fluid">
                <Link className="navbar-brand left" to="/">Job Portal</Link>
                <div className="right">
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav-right" aria-controls="nav-right" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="nav-right">
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
            </div>
        </nav>
    )
}

export default Nav
