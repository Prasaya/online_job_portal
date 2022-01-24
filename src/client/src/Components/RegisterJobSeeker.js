import {useForm} from "react-hook-form"

function RegisterJobSeeker(){
    const {register, handleSubmit} = useForm()
    const onSubmitForm = (data) => console.log(data)

    return (
        <div className="container register-account">
            <div className="row justify-content-center my-5 center-text">
                <header className="text-center"><h3>Job Seeker Account Registration</h3></header>
                <div className="col-lg-4">
                    <form action="#" onSubmit={handleSubmit(onSubmitForm)}>
                        <input {...register("firstname", {required:true})} type="text" className="form-control form-control-lg" placeholder="Firstname" />
                        <input {...register("lastname", {required:true})} type="text" className="form-control form-control-lg my-2" placeholder="Lastname" />
                        <input {...register("email", {required:true})} type="email"  className="form-control form-control-lg my-2" placeholder="Email" />
                        <input {...register("phone",{})} type="text" defaultValue={""} className="form-control form-control-lg my-2" placeholder="Phone Number"  />
                        <input {...register("birthday", {required:true})} type="date" className="form-control form-control-lg my-2" placeholder="Birthday" />
                        <select {...register("faculty", {required:true})} className="form-select form-select-lg my-2" >
                            <option value="bct">BCT</option>
                            <option value="bme">BME</option>
                            <option value="bce">BCE</option>
                            <option value="bei">BEI</option>
                        </select>
                        <input {...register("password", {required:true, pattern:/(?=.*)(?=.*[a-z])(?=.*[A-Z]).{8,}/})} type="password" title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters" className="form-control form-control-lg my-2" placeholder="Password" ></input>
                        <div className="d-grid gap-2">
                            <button className="btn btn-success btn-lg" type="submit">Sign Up</button>
                        </div>
                    </form>
                </div>
            </div>  
        </div>
    )
}

export default RegisterJobSeeker