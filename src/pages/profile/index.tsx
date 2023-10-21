import PostBox from 'components/post/PostBox';
import AuthContext from 'context/AuthContext';
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { db } from 'firebaseApp';
import { PostProps } from 'pages/home';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PROFILE_DEFULT_URL = '/profile.png';

const ProfilePage = () => {
  const [posts, setPosts] = useState<PostProps[]>([]);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      let postsRef = collection(db, 'posts');
      let postsQuery = query(
        postsRef,
        where('uid', '==', user.uid),
        orderBy('createdAt', 'desc'),
      );

      onSnapshot(postsQuery, (snapShot) => {
        let dataObj = snapShot.docs.map((doc) => ({
          ...doc.data(),
          id: doc?.id,
        }));
        setPosts(dataObj as PostProps[]);
      });
    }
  });

  return (
    <>
      <header className="home">
        <h1 className="home__title">Profile</h1>
      </header>
      <main className="post">
        <div className="profile">
          <img
            src={user?.photoURL || PROFILE_DEFULT_URL}
            alt="프로필 이미지"
            className="profile__image"
            width={100}
            height={100}
          />
          <button
            type="button"
            className="profile__btn"
            onClick={() => {
              navigate('/profile/edit');
            }}
          >
            프로필 수정
          </button>
        </div>
        <div className="profile__text">
          <div className="profile__name">{user?.displayName || '사용자'}님</div>
          <div className="profile__email">{user?.email}</div>
        </div>
        <nav className="home__tabs">
          <button className="home__tab home__tab--active">내가 쓴 글</button>
          <button className="home__tab">좋아요</button>
        </nav>
        {posts?.length > 0 ? (
          posts?.map((post) => <PostBox post={post} key={post.id} />)
        ) : (
          <div className="no-post">
            <p className="no-post__text">게시글이 없습니다.</p>
          </div>
        )}
      </main>
    </>
  );
};

export default ProfilePage;
