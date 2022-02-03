import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import {useState} from "react"
function Login(){
    const {register, handleSubmit} = useForm()
    const [authStatus, setauthStatus] = useState(false);
    const [uid, setUid] = useState("");

    const onSubmit = async (data) => {
        const res = await fetch('/api/auth/login',{
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const jsonVal = await res.json()
        const isAuth = jsonVal.success
        if (isAuth) {
            setauthStatus(true)
        }
    }

    return (
        <div className="container log-in">
            <div className="row justify-content-center my-5">
                <div className="col-lg-4">
                    <form action="#" onSubmit={handleSubmit(onSubmit)}>
                    <input {...register("username", {required:true})} type="email" className="form-control form-control-lg my-2" placeholder="Email" />

                    <input {...register("password", {required:true})} type="password" className="form-control form-control-lg my-2" placeholder="Password" ></input>
                        <div className="d-grid gap-2">
                            <button className="btn btn-primary btn-lg" type="submit">Log In</button>
                        </div>
                    </form>
                    <hr />
                    <div className="d-grid gap-2">
                        <Link to="register-jobseeker" className="btn btn-success btn-lg">Create new job seeker account</Link>
                        <Link to="register-company" className="btn btn-success btn-lg">Create new employer account</Link>
                    </div>
                </div>
            </div>  
        </div>
        
    )
}

export default Login