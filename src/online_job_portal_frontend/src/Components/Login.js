import { Link } from "react-router-dom"

function Login(){
    return (
        <div className="container log-in">
            <div className="row justify-content-center my-5">
                <div className="col-lg-4">
                    <form action="#">
                        <input type="email" className="form-control form-control-lg" placeholder="Email"/>
                        <input type="password" className="form-control form-control-lg my-2" placeholder="Password"/>
                        <div className="d-grid gap-2">
                            <button className="btn btn-primary btn-lg" type="submit">Log In</button>
                        </div>
                    </form>
                    <hr />
                    <div className="d-grid gap-2">
                        <Link to="register" className="btn btn-success btn-lg">Create new account</Link>
                    </div>
                </div>
            </div>  
        </div>
        
    )
}

export default Login