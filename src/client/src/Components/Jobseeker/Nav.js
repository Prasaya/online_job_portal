import { Link } from "react-router-dom"
//navbar collapse not working
function Nav(){
    return(
        <nav className="navbar navbar-expand-lg navbar-light bg-light py-2">
            <div className="container-fluid d-flex flex-row justify-content-between">
                <Link className="navbar-brand left" to="/">Job Portal</Link>
                <div className="right">
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link" to="overview">Overview</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/">My Status</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/">My Profile</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/">Settings</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Nav
