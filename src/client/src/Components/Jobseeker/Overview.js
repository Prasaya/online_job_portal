import {useState, useEffect} from "react"

function Overview() {
    const [jobs, setJobs] = useState([])

    async function fetchJobs(){
        const res = await fetch("http://localhost:4000/jobs")
        const data = await res.json()
        return data
    }

    useEffect(() => {
        async function getJobs(){
            const overviewJobs = await fetchJobs()
            setJobs(overviewJobs) 
        }
        getJobs()
    })

    return ( 
        <div className="overview">
            <h1>Overview</h1>
            <div className="jobs container bg-light">
                {jobs.map((job) => {
                    return (
                        <div className="job d-flex flex-row justify-content-between align-items-center my-2" id={job.id}>
                            <div className="d-flex flex-column">
                                <h3>{job.title}</h3>
                                <h6>Deadline: {job.deadline}</h6>
                            </div>
                            <div>
                                <button className="btn btn-primary">{job.applied?"Unapply":"Apply"}</button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Overview