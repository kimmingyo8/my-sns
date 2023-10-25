import { FaRegComment, FaUserCircle } from 'react-icons/fa';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import { PostProps } from 'pages/home';
import { useContext } from 'react';
import AuthContext from 'context/AuthContext';
import {
  arrayRemove,
  arrayUnion,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { db, storage } from 'firebaseApp';
import { toast } from 'react-toastify';
import { deleteObject, ref } from 'firebase/storage';
import FollowingBox from 'components/following/FollowingBox';
import useTranslation from 'hooks/useTranslation';

interface PostBoxProps {
  post: PostProps;
}

const PostBox = ({ post }: PostBoxProps) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const imageRef = ref(storage, post?.imageUrl);
  const trans = useTranslation();

  const toggleLike = async () => {
    const postRef = doc(db, 'posts', post.id);

    if (user?.uid && post?.likes?.includes(user?.uid)) {
      // 사용자가 좋아요 해 놓은 경우 -> 취소
      await updateDoc(postRef, {
        likes: arrayRemove(user?.uid),
        likeCount: post?.likeCount ? post?.likeCount - 1 : 0,
      });
    } else {
      // 좋아요 하지 않은 경우 -> 추가
      await updateDoc(postRef, {
        likes: arrayUnion(user?.uid),
        likeCount: post?.likeCount ? post?.likeCount + 1 : 1,
      });
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm('해당 게시글을 삭제하시겠습니까?');
    if (confirm) {
      // 스토리지 이미지 먼저 삭제
      if (post?.imageUrl) {
        deleteObject(imageRef).catch((err) => console.log(err));
      }
      await deleteDoc(doc(db, 'posts', post.id));
      toast.success('게시글을 삭제했습니다.');
      navigate('/');
    }
  };

  return (
    <article className="post__box" key={post?.id}>
      <section className="post__box-main">
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
          <FollowingBox post={post} />
        </div>
        <Link to={`/posts/${post?.id}`}>
          <p className="post__box-content">{post?.content}</p>
          {post?.imageUrl && (
            <div className="post__image-div">
              <img
                src={post?.imageUrl}
                alt="게시글 이미지"
                className="post__image"
                width={100}
                height={100}
              />
            </div>
          )}
          <ul className="post-form__hashtags-outputs">
            {post?.hashTags?.map((tag, index) => (
              <li className="post-form__hashtags-tag" key={index}>
                #{tag}
              </li>
            ))}
          </ul>
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
              {trans('BUTTON_DELETE')}
            </button>
            <button type="button" className="post__edit">
              <Link to={`/posts/edit/${post?.id}`}>{trans('BUTTON_EDIT')}</Link>
            </button>
          </>
        )}
        <button type="button" className="post__likes" onClick={toggleLike}>
          {user && post?.likes?.includes(user.uid) ? (
            <AiFillHeart />
          ) : (
            <AiOutlineHeart />
          )}
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
