import { FiImage } from 'react-icons/fi';

const PostForm = () => {
  const handleFileUpload = () => {};

  return (
    <form className="post-form">
      <textarea
        className="post-form__textarea"
        name="content"
        id="content"
        placeholder="오늘 하루를 기록하세요!"
      />
      <div className="post-form__submit">
        <label htmlFor="file-input" className="post-form__file">
          <FiImage className="post-form__file-icon" />
        </label>
        <input
          type="file"
          name="file-input"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        <button className="post-form__submit-btn">작성</button>
      </div>
    </form>
  );
};

export default PostForm;
