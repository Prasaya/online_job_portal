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
    }, [])

    async function toggleApply(e){
        const toggleJobID = Number(e.target.id) 
        var updatedJob = {}
        const newJobs = jobs.map((job) => {
            if (job.id === toggleJobID){
                job.applied = !(job.applied) 
                updatedJob = job
            }
            return job
        })
        setJobs(newJobs)

        fetch(`http://localhost:4000/jobs/${toggleJobID}`,{
                method: "PUT",
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(updatedJob)
            })
        
    }

    return ( 
        <div className="overview">
            <h1>Overview</h1>
            <div className="jobs container bg-light">
                {jobs.map((job) => {
                    return (
                        <div className="job d-flex flex-row justify-content-between align-items-center my-2">
                            <div className="d-flex flex-column">
                                <h3>{job.title}</h3>
                                <h6>Deadline: {job.deadline}</h6>
                            </div>
                            <div>
                                <button id={job.id} className="btn btn-primary" onClick={toggleApply}>{job.applied?"Unapply":"Apply"}</button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Overview