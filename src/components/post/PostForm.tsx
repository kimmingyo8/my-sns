import AuthContext from 'context/AuthContext';
import { addDoc, collection } from 'firebase/firestore';
import { db } from 'firebaseApp';
import { useContext, useState } from 'react';
import { FiImage } from 'react-icons/fi';
import { toast } from 'react-toastify';

const PostForm = () => {
  const [content, setContent] = useState<string>('');
  const { user } = useContext(AuthContext);
  const handleFileUpload = () => {};

  const onSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'posts'), {
        content: content,
        createdAt: new Date()?.toLocaleDateString('ko', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
        uid: user?.uid,
        email: user?.email,
      });
      setContent('');
      toast.success('게시글을 생성했습니다.');
    } catch (e: any) {
      console.log(e);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'content') {
      setContent(value);
    }
  };

  return (
    <form className="post-form" onSubmit={onSubmit}>
      <textarea
        className="post-form__textarea"
        name="content"
        id="content"
        placeholder="오늘 하루를 기록하세요!"
        onChange={onChange}
        value={content}
      />
      <div className="post-form__submit">
        <label htmlFor="file-input" className="post-form__file">
          <FiImage className="post-form__file-icon" />
        </label>
        <input
          type="file"
          name="file-input"
          id="file-input"
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
