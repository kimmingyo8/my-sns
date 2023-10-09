import { FaRegComment, FaUserCircle } from 'react-icons/fa';
import { AiFillHeart } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { PostProps } from 'pages/home';

interface PostBoxProps {
  post: PostProps;
}

const PostBox = ({ post }: PostBoxProps) => {
  const handleDelete = () => {};

  return (
    <li className="post__box" key={post?.id}>
      <Link to={`/posts/${post?.id}`} className="post__box-main">
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
      <div className="post__box-footer">
        {/* post.uid === user.uid */}
        <>
          <button type="button" className="post__delete" onClick={handleDelete}>
            삭제
          </button>
          <button type="button" className="post__edit">
            <Link to={`/posts/edit/${post?.id}`}>수정</Link>
          </button>
        </>
        <button type="button" className="post__likes">
          <AiFillHeart />
          {post?.likeCount || 0}
        </button>
        <button type="button" className="post__comments">
          <FaRegComment />
          {post?.comments?.length || 0}
        </button>
      </div>
    </li>
  );
};

export default PostBox;
