import { Link } from "react-router-dom"
import { useState } from "react"

function Login(){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onSubmit = (e) => {
        e.preventDefault()
        console.log(email, password)
        setEmail('')
        setPassword('')
    }

    return (
        <div className="container log-in">
            <div className="row justify-content-center my-5">
                <div className="col-lg-4">
                    <form action="#" onSubmit={onSubmit}>
                        <input type="email" 
                        name="email"
                        id="login-email"
                        className="form-control form-control-lg" 
                        placeholder="Email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required/>

                        <input type="password" 
                        name="password"
                        id="login-password"
                        className="form-control form-control-lg my-2" 
                        placeholder="Password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        minLength={7}
                        maxLength={20}
                        required/>
                        <div className="d-grid gap-2">
                            <button className="btn btn-primary btn-lg" type="submit">Log In</button>
                        </div>
                    </form>
                    <hr />
                    <div className="d-grid gap-2">
                        <Link to="register-jobseeker" className="btn btn-success btn-lg">Create new job seeker account</Link>
                        <Link to="register-jobseeker" className="btn btn-success btn-lg">Create new employer account</Link>
                    </div>
                </div>
            </div>  
        </div>
        
    )
}

export default Login