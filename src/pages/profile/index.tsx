import { languageState } from 'atom';
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
import { useRecoilState } from 'recoil';

const PROFILE_DEFULT_URL = '/profile.png';

type TabType = 'my' | 'like';

const ProfilePage = () => {
  const [activeTab, setactiveTab] = useState<TabType>('my');
  const [myPosts, setMyPosts] = useState<PostProps[]>([]);
  const [likePosts, setLikePosts] = useState<PostProps[]>([]);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [language, setLanguage] = useRecoilState(languageState);

  const onClickLanguage = () => {
    setLanguage(language === 'ko' ? 'en' : 'ko');
    localStorage.setItem('language', language === 'ko' ? 'en' : 'ko');
  };

  useEffect(() => {
    if (user) {
      let postsRef = collection(db, 'posts');
      const myPostsQuery = query(
        postsRef,
        where('uid', '==', user.uid),
        orderBy('createdAt', 'desc'),
      );
      const likePostsQuery = query(
        postsRef,
        where('likes', 'array-contains', user.uid),
        orderBy('createdAt', 'desc'),
      );

      onSnapshot(myPostsQuery, (snapShot) => {
        let dataObj = snapShot.docs.map((doc) => ({
          ...doc.data(),
          id: doc?.id,
        }));
        setMyPosts(dataObj as PostProps[]);
      });

      onSnapshot(likePostsQuery, (snapShot) => {
        let dataObj = snapShot.docs.map((doc) => ({
          ...doc.data(),
          id: doc?.id,
        }));
        setLikePosts(dataObj as PostProps[]);
      });
    }
  }, [user]);

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
          <div className="profile__flex">
            <button
              type="button"
              className="profile__btn"
              onClick={() => {
                navigate('/profile/edit');
              }}
            >
              프로필 수정
            </button>
            <button
              type="button"
              className="profile__btn--language"
              onClick={onClickLanguage}
            >
              {language === 'ko' ? '한국어' : 'English'}
            </button>
          </div>
        </div>
        <div className="profile__text">
          <div className="profile__name">{user?.displayName || '사용자'}님</div>
          <div className="profile__email">{user?.email}</div>
        </div>
        <nav className="home__tabs">
          <button
            className={`home__tab ${activeTab === 'my' && 'home__tab--active'}`}
            onClick={() => setactiveTab('my')}
          >
            내가 쓴 글
          </button>
          <button
            className={`home__tab ${
              activeTab === 'like' && 'home__tab--active'
            }`}
            onClick={() => setactiveTab('like')}
          >
            좋아요
          </button>
        </nav>
        {activeTab === 'my' && (
          <>
            {myPosts?.length > 0 ? (
              myPosts?.map((post) => <PostBox post={post} key={post.id} />)
            ) : (
              <div className="no-post">
                <p className="no-post__text">게시글이 없습니다.</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'like' && (
          <>
            {likePosts?.length > 0 ? (
              likePosts?.map((post) => <PostBox post={post} key={post.id} />)
            ) : (
              <div className="no-post">
                <p className="no-post__text">게시글이 없습니다.</p>
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
};

export default ProfilePage;
