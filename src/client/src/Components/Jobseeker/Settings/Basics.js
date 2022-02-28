import {useForm} from "react-hook-form";
import {useState, useEffect} from "react";
function Basics() {
    const [isSearchingForJob, setIsSearchingForJob] = useState(false)
    const [smsNotification, setSmsNotification] = useState(false)
    const [emailNotification, setEmailNotification] = useState(false)
    const [allInfo, setAllInfo] = useState({})
    const [isUpdateFail, setIsUpdateFail] = useState(false)
    const [isUpdateSuccess, setIsUpdateSuccess] = useState(false)
    const {
        register,
        handleSubmit,
      } = useForm({
        mode: "onBlur",
      });

    const fetchInfo = async () => {
    const res = await fetch('http://localhost:4000/profile');
    const data = await res.json();
    return data;
    };

    useEffect(() => {
    const getInfo = async () => {
        const info = await fetchInfo();
        setAllInfo(info)
        setIsSearchingForJob(info.settings.basics.searchingForJob)
        setEmailNotification(info.settings.basics.emailNotification)
        setSmsNotification(info.settings.basics.smsNotification)
    };
    getInfo();
    }, []);

    const onSubmitForm = async (data) => {
        let info = allInfo
        info.settings.basics.searchingForJob = isSearchingForJob
        info.settings.basics.emailNotification = emailNotification
        info.settings.basics.smsNotification = smsNotification
        const res = await fetch(`http://localhost:4000/profile`, {
            method: 'PUT',
            headers: {
              'Content-type': 'application/json',
            },
            body: JSON.stringify(info),
          });
          if(res.status === 200){
            setIsUpdateSuccess(true)
          }else{
            setIsUpdateFail(true)
          }
          //stop displaying after 3 seconds
          setTimeout(() => {
            setIsUpdateFail(false)
            setIsUpdateSuccess(false)
          }, 3000);
    }
    return (
        <>
            <h1>Basics</h1>
            <div className="container ">
                <div className="row d-flex justify-content-center">
                    <form action="#" onSubmit={handleSubmit(onSubmitForm)}>
                        <div class="form-check form-switch mb-3">
                            <input {...register("searchingForJob")} 
                                className="form-check-input" 
                                type="checkbox" 
                                checked={isSearchingForJob} 
                                onChange={() => setIsSearchingForJob(!isSearchingForJob)}
                                id="searchingForJob"
                            />
                            <label className="form-check-label" for="searchingForJob">Searching for Job</label>
                        </div>
                        <div class="form-check form-switch mb-3">
                            <input {...register("emailNotification")} 
                                className="form-check-input" 
                                type="checkbox"
                                checked={emailNotification} 
                                onChange={() => setEmailNotification(!emailNotification)}
                                id="emailNotification"
                            />
                            <label className="form-check-label" for="emailNotification">Receive Email Notification</label>
                        </div>
                        <div class="form-check form-switch mb-3">
                            <input {...register("smsNotification")} 
                                className="form-check-input" 
                                type="checkbox" 
                                checked={smsNotification}
                                onChange={() => setSmsNotification(!smsNotification)}
                                id="smsNotification"
                            />
                            <label className="form-check-label" for="smsNotification">Receive SMS Notification</label>
                        </div>
                        {isUpdateSuccess && <p className='text-success'>Updated Successfully</p>}
                        {isUpdateFail && <p className='text-danger'>Update Failed</p>}
                        <button className="btn btn-primary mb-3" type="submit">Update</button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Basics;