function JobPost() {
  return (
    <div>
      <h1>Post New Job</h1>
      <div className="container bg-light d-flex justify-content-center">
        <form className="row col-lg-6" action="#">
        <div className="col-12 mb-3">
            <label className="form-label" htmlFor="jobTitle">
            Job Title
            </label>
            <input className="form-control" type="text" id="jobTitle" required />
        </div>
        <div className="col-12 mb-3">
            <label className="form-label" htmlFor="vacancy">
            Number of Vacancies
            </label>
            <input className="form-control" type="text" id="vacancy" required />
        </div>
        <div className="col-12 mb-3">
            <label className="form-label" htmlFor="description">
            Job Description
            </label>
            <textarea className="form-control" id="description" rows="3" required />
        </div>
        <div className="col-12 mb-3">
            <label className="form-label" htmlFor="experience">
            Work Experience
            </label>
            <input className="form-control" type="text" id="experience" required />
        </div>
        <div className="col-4 mb-3">
            <label className="form-label" htmlFor="educationLevel">Education Level</label>
            <select className="form-select" id="educationLevel" required>
                <option selected disabled value="">Choose...</option>
                <option value="Masters">Masters</option>
                <option value="Bachelors">Bachelors</option>
                <option value="Doctorate">Doctorate</option>
                <option value="Diploma">Certificate/Diploma</option>
                <option value="Pre-Diploma">Pre-Diploma</option>
                <option value="Post Graduate Diploma">Post Graduate Diploma</option>
                <option value="Chartered Accountant">Chartered Accountant</option>
                <option value="Master of Philosophy">Master of Philosophy</option>
            </select>
        </div>
        <div className="col-8 mb-3">
            <label className="form-label" htmlFor="degree">Degree</label>
            <input className="form-control" type="text" id="degree" list="degreeOptions" />
            <datalist id="degreeOptions">
            <option value="BSc Computer Science and Information Technology" />
            <option value="Bachelor of Computer Application" />
            <option value="Bachelor of Information Technology" />
            <option value="Bachelor of Software Engineering" />
            </datalist>
        </div>
        <div className="col-12 mb-3">
            <label className="form-label" htmlFor="skills">Skills</label>
            <input className="form-control" type="text" id="skills" />
        </div>
        <div className="">
            <button className="btn btn-primary btn-lg" type="submit">Submit</button>
        </div>
        </form>
      </div>
    </div>
  );
}

export default JobPost;
