import { Link, useLocation } from "react-router-dom"
import {useState, useEffect} from "react"
import "./nav.css"

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
    const [avatar, setAvatar] = useState("")
    const stockPhoto = "http://stock.wikimini.org/w/images/9/95/Gnome-stock_person-avatar-profile.png"

    const fetchAvatar = async () => {
        const res = await fetch("/api/user")
        const data = await res.json()
        return data.user.basics.picture ? '/api/user/avatar' : stockPhoto;
    }

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(()=>{
        const getAvatar = async () => {
            const data = await fetchAvatar()
            setAvatar(data || stockPhoto)
        }
        getAvatar()
    },[])

    return(
        <nav className="navbar navbar-expand-lg navbar-light bg-light py-2">
            <div className="container-fluid">
                <Link className="navbar-brand left" to="/">Job Portal</Link>
                <div className="right">
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav-right" aria-controls="nav-right" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="nav-right">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                {navElements.map((element) => {
                                    return(
                                        <li className="nav-link" key={element.name}>
                                            <Link onClick={OnClick} className={`nav-link ${element.status}`} to={element.to} id={`${element.to}`}>{element.name}</Link>
                                        </li>
                                    )
                                })}
                                <li className="dropdown">
                                    <img src={avatar || stockPhoto} alt="avatar" className="rounded-circle mx-auto img img-thumbnail float-end dropdown-toggle" id="dropdownMenuImage" data-bs-toggle="dropdown"/>
                                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuImage">
                                        <li><a className="dropdown-item" href="/login">Log Out</a></li>
                                    </ul>
                                </li>
                            </ul>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Nav
