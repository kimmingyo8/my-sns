import AuthContext from 'context/AuthContext';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { db } from 'firebaseApp';
import { PostProps } from 'pages/home';
import { useContext, useState } from 'react';
import { toast } from 'react-toastify';

interface CommentFormProps {
  post: PostProps | null;
}
const CommentForm = ({ post }: CommentFormProps) => {
  const [comment, setComment] = useState<string>('');
  const { user } = useContext(AuthContext);

  const onSubmit = async (e: any) => {
    e.preventDefault();

    if (post && user) {
      try {
        const postRef = doc(db, 'posts', post?.id);

        const commentObj = {
          comment: comment,
          uid: user?.uid,
          email: user?.email,
          createdAt: new Date()?.toLocaleDateString('ko', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }),
        };

        await updateDoc(postRef, {
          comments: arrayUnion(commentObj),
        });

        toast.success('댓글을 생성했습니다.');
        setComment('');
      } catch (e: any) {
        console.log(e);
      }
    }
  };
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'comment') {
      setComment(value);
    }
  };
  return (
    <form className="post-form" onSubmit={onSubmit}>
      <textarea
        name="comment"
        id="comment"
        required
        placeholder="댓글을 남겨보세요."
        className="post-form__textarea"
        onChange={onChange}
        value={comment}
      />
      <div className="post-form__submit-area">
        <div />
        <button className="post-form__submit-btn" disabled={!comment}>
          댓글
        </button>
      </div>
    </form>
  );
};

export default CommentForm;