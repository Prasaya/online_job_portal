import { Link, useLocation } from "react-router-dom"

function Header(){
    const path = useLocation().pathname
    if (path.startsWith('/jobseeker') || path.startsWith('/company')){
        return (
            <></>
        )
    }else{
        return (
            <header className="header text-center container my-5"><h3><Link to="/" id="header">Job Portal</Link></h3></header>
        )
    }
}
export default Header