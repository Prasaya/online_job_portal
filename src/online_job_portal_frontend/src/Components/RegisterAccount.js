function RegisterAccount(){
    return (
        <div className="container register-account">
            <div className="row justify-content-center my-5">
                <div className="col-lg-4">
                    <form action="#">
                        <input type="text" className="form-control form-control-lg" placeholder="Firstname" required/>
                        <input type="text" className="form-control form-control-lg my-2" placeholder="Lastname" required/>
                        <input type="email" className="form-control form-control-lg my-2" placeholder="Email" required/>
                        <input type="text" className="form-control form-control-lg my-2" placeholder="Phone Number"/>
                        <input type="text" className="form-control form-control-lg my-2" placeholder="College Name" required/>
                        <input type="date" className="form-control form-control-lg my-2" placeholder="Birthday"/>
                        <div className="d-grid gap-2">
                            <button className="btn btn-success btn-lg" type="submit">Sign Up</button>
                        </div>
                    </form>
                </div>
            </div>  
        </div>
    )
}

export default RegisterAccount