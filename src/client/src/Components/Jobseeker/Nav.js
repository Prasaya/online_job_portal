import { Link } from "react-router-dom"
//todo:highlight active tab
function Nav(){
    return(
        <nav className="navbar navbar-expand-lg navbar-light bg-light py-2">
            <div className="container-fluid d-flex flex-row justify-content-between">
                <Link className="navbar-brand left" to="/">Job Portal</Link>
                <div className="right">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link" to="overview">Overview</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="mystatus">My Status</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="myprofile">My Profile</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="settings">Settings</Link>
                            </li>
                        </ul>
                </div>
            </div>
        </nav>
    )
}

export default Nav
