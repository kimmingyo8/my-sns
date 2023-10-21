import { IoIosArrowBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

const PostHeader = () => {
  const navigate = useNavigate();
  return (
    <header className="post__header">
      <button className="button" onClick={() => navigate(-1)}>
        <IoIosArrowBack className="post__header-btn" />
      </button>
    </header>
  );
};

export default PostHeader;
