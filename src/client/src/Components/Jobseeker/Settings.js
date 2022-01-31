import {useForm} from "react-hook-form"
function Settings() {
    const {register, handleSubmit} = useForm()
    const onSubmitForm = (data) => console.log(data)
    return ( 
        <div className="settings">
            <h1>Settings</h1>
            <div className="container settings">
                <div className="row d-flex justify-content-center">
                    <form action="#" onSubmit={handleSubmit(onSubmitForm)}>
                        <label htmlFor="currentPassword">Current Password</label>
                        <input className="form-control my-2" type="password" id="currentPassword" {...register("currentPassword",{required:true})}/>

                        <label htmlFor="newPassword">New Password</label>
                        <input className="form-control my-2" type="password" id="newPassword" {...register("newPassword",{required:true, pattern:/(?=.*)(?=.*[a-z])(?=.*[A-Z]).{8,}/})}/>

                        <button className="btn btn-primary" type="submit">Update</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Settings;