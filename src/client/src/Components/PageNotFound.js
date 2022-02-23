import { Link } from "react-router-dom";
function PageNotFount() {
    return (
        <div className="row align-items-center justify-content-center text-center my-5">
            <div className="col-4">
                <img src="https://png.pngtree.com/png-vector/20191022/ourlarge/pngtree-question-mark-businessman-vector-task-hr-concept-find-new-job-huge-png-image_1841501.jpg" alt="error:404" />
            </div>
            <div className="col-4">
                <h1 className="pb-3">Error:404</h1>
                <h1 className="pb-5">Page Not Found</h1>
                <Link to="/" className="btn btn-primary">
                    Go to Homepage
                </Link>
            </div>
            
        </div>
    );
}

export default PageNotFount;