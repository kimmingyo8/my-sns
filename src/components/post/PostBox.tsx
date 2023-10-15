import { FaRegComment, FaUserCircle } from 'react-icons/fa';
import { AiFillHeart } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { PostProps } from 'pages/home';
import { useContext } from 'react';
import AuthContext from 'context/AuthContext';

interface PostBoxProps {
  post: PostProps;
}

const PostBox = ({ post }: PostBoxProps) => {
  const { user } = useContext(AuthContext);
  const handleDelete = () => {};

  return (
    <article className="post__box" key={post?.id}>
      <section className="post__box-main">
        <Link to={`/posts/${post?.id}`}>
          <div className="post__profile">
            {post?.profileUrl ? (
              <img
                className="post__profile-img"
                src={post?.profileUrl}
                alt="프로필"
              />
            ) : (
              <FaUserCircle className="post__profile-icon" />
            )}
            <p className="post__profile-email">{post?.email}</p>
            <p className="post__profile-createdAt">{post?.createdAt}</p>
          </div>
          <p className="post__box-content">{post?.content}</p>
        </Link>
      </section>
      <section className="post__box-footer">
        {user?.uid === post?.uid && (
          <>
            <button
              type="button"
              className="post__delete"
              onClick={handleDelete}
            >
              삭제
            </button>
            <button type="button" className="post__edit">
              <Link to={`/posts/edit/${post?.id}`}>수정</Link>
            </button>
          </>
        )}
        <button type="button" className="post__likes">
          <AiFillHeart />
          {post?.likeCount || 0}
        </button>
        <button type="button" className="post__comments">
          <FaRegComment />
          {post?.comments?.length || 0}
        </button>
      </section>
    </article>
  );
};

export default PostBox;
