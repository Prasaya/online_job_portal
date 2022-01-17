import {useState} from "react"

function RegisterJobSeeker(){
    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [email, setEmail] = useState('')
    const [phonenumber, setPhonenumber] = useState('')
    const [birthday, setBirthday] = useState('')
    const [course, setCourse] = useState('bct')
    const [password, setPassword] = useState('')

    const onSubmit = (e) => {
        e.preventDefault()
        setFirstname('')
        setLastname('')
        setEmail('')
        setPhonenumber('')
        setBirthday('')
        setCourse('bct')
        setPassword('')
    }

    return (
        <div className="container register-account">
            <div className="row justify-content-center my-5 center-text">
                <header className="text-center"><h3>Job Seeker Account Registration</h3></header>
                <div className="col-lg-4">
                    <form action="#" onSubmit={onSubmit}>
                        <input type="text" className="form-control form-control-lg" placeholder="Firstname" value={firstname} onChange={(e) => setFirstname(e.target.value)} required/>
                        <input type="text" className="form-control form-control-lg my-2" placeholder="Lastname" value={lastname} onChange={(e) => setLastname(e.target.value)} required/>
                        <input type="email" className="form-control form-control-lg my-2" placeholder="Email" value={email} onChange={(e) =>setEmail(e.target.value)} required/>
                        <input type="text" className="form-control form-control-lg my-2" placeholder="Phone Number" value={phonenumber} onChange={(e) =>setPhonenumber(e.target.value)} />
                        <input type="date" className="form-control form-control-lg my-2" placeholder="Birthday" value={birthday} onChange={(e) =>setBirthday(e.target.value)} required/>
                        <select className="form-select form-select-lg my-2" value={course} onChange={(e) =>setCourse(e.target.value)}>
                            <option value="bct">BCT</option>
                            <option value="bme">BME</option>
                            <option value="bce">BCE</option>
                            <option value="bei">BEI</option>
                        </select>
                        <input type="password" className="form-control form-control-lg my-2" placeholder="Password" minLength={7} value={password} onChange={(e) =>setPassword(e.target.value)} required></input>
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