import { useContext, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import UserContext from "../Context/UserContext"

function Login(){
    const {register, handleSubmit} = useForm();
    const userCtx = useContext(UserContext)
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        const res = await fetch('/api/auth/login',{
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const jsonVal = await res.json()
        console.log(jsonVal)
        const isAuth = jsonVal.success
        if (isAuth) {
            const userStatus = {
                authStatus: isAuth,
                id: jsonVal.user.user.basics.id,
                type: jsonVal.user.user.basics.type
            }
            userCtx.updateUserStatus(userStatus)
        }
    }

    useEffect(() => {
        if(userCtx.authStatus) {
            if(userCtx.type === "Users") {
                navigate("/jobseeker/overview", {replace: true})
            }
            else if(userCtx.type === "Organizations") {
                navigate("/company/overview", {replace: true})
            }
        }
    })

    return (
        <div className="container log-in">
            <div className="row justify-content-center my-5">
                <div className="col-lg-4">
                    <form onSubmit={handleSubmit(onSubmit)}>
                    <input {...register("username", {required:true})} type="text" className="form-control form-control-lg my-2" placeholder="Email or Username" />

                    <input {...register("password", {required:true})} type="password" className="form-control form-control-lg my-2" placeholder="Password" ></input>
                    {errors.loginError && <div className="alert alert-danger my-2">{errors.loginError.message}</div>}
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
