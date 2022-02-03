function RegisterCompany(){
    return (
        <div className="container register-account">
            <div className="row justify-content-center my-5 center-text">
                <header className="text-center"><h3>Company Account Registration</h3></header>
                <div className="col-lg-4 my-2">
                    <form action="#">
                        <div className="form-floating mb-3">
                            <input type="text" className="form-control form-control-lg" placeholder="Company Name" id="companyName" required />
                            <label for="companyName">Company Name</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input type="email" className="form-control form-control-lg" placeholder="Company Name" id="companyName" required />
                            <label for="companyEmail">Company Email</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input type="number" className="form-control form-control-lg" placeholder="Phone Number" id="companyName" required />
                            <label for="phoneNumber">Phone Number</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input type="password" className="form-control form-control-lg" placeholder="Password" id="companyPassword" required />
                            <label for="companyPassword">Password</label>
                        </div>
                        <div className="d-grid gap-2">
                            <button className="btn btn-success btn-lg" type="submit">Sign Up</button>
                        </div>
                    </form>
                </div>
            </div>  
        </div>
    )
}

export default RegisterCompany