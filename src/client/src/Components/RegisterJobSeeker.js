function RegisterJobSeeker(){
    return (
        <div className="container register-account">
            <div className="row justify-content-center my-5 center-text">
                <header className="text-center"><h3>Job Seeker Account Registration</h3></header>
                <div className="col-lg-4">
                    <form action="#">
                        <input type="text" className="form-control form-control-lg" placeholder="Firstname" required/>
                        <input type="text" className="form-control form-control-lg my-2" placeholder="Lastname" required/>
                        <input type="email" className="form-control form-control-lg my-2" placeholder="Email" required/>
                        <input type="text" className="form-control form-control-lg my-2" placeholder="Phone Number"/>
                        <input type="date" className="form-control form-control-lg my-2" placeholder="Birthday" required/>
                        <select className="form-select form-select-lg my-2">
                            <option selected>BCT</option>
                            <option value="bme">BME</option>
                            <option value="bce">BCE</option>
                            <option value="bei">BEI</option>
                        </select>
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