import { useParams } from "react-router-dom";

function Job() {
    const { id } = useParams();
  return <>Job {id}</>;
}

export default Job;
