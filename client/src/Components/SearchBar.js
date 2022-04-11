import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

function SearchBar() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm({
    mode: 'onBlur',
  });
  const onSubmitForm = (data) => {
    navigate(`/jobs/search?query=${data.search}`);
  };
  return (
    <div className="search-bar mt-1">
      <form className="d-flex" onSubmit={handleSubmit(onSubmitForm)}>
        <input
          {...register('search', { required: true })}
          className="form-control me-2"
          type="search"
          placeholder="Search"
        />
        <button className="btn btn-outline-primary" type="submit">
          Search
        </button>
      </form>
    </div>
  );
}

export default SearchBar;
