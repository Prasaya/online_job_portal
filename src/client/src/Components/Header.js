import { Link } from "react-router-dom"

function Header(){
    return(
        <header className="header text-center my-5"><h1><Link to="/" id="header">Job Portal</Link></h1></header>
    )
}
export default Header