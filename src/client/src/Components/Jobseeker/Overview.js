import {useState, useEffect} from "react"
import Job from "./Job"

function Overview() {
    const [jobs, setJobs] = useState([])

    async function fetchJobs(){
        const res = await fetch("/jobs")
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
        const toggleJobID = Number(e.target.dataset.jobId) 
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
        <div className="overview ">
            <h1>Overview</h1>
            <div className="jobs container bg-light">
                {jobs.map((job) => {
                    return (
                        <Job job={job} OnClick={toggleApply} />
                    )
                })}
            </div>
        </div>
    )
}

export default Overview