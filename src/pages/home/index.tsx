import PostBox from 'components/post/PostBox';
import PostForm from 'components/post/PostForm';
import AuthContext from 'context/AuthContext';
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { db } from 'firebaseApp';
import { useCallback, useContext, useEffect, useState } from 'react';

export interface PostProps {
  id: string;
  email: string;
  content: string;
  createdAt: string;
  uid: string;
  profileUrl?: string;
  likes?: string[];
  likeCount?: number;
  comments?: any;
  hashTags?: string[];
  imageUrl?: string;
}

interface UserProps {
  id: string;
}

type tabType = 'all' | 'following';

const HomePage = () => {
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [followingPosts, setFollowingPosts] = useState<PostProps[]>([]);
  const [followingIds, setFollowingIds] = useState<string[]>(['']);
  const [activeTab, setActiveTab] = useState<tabType>('all');
  const { user } = useContext(AuthContext);

  // 실시간 동기화로 user의 팔로잉 id 배열 가져오기
  const getFollowingIds = useCallback(async () => {
    if (user?.uid) {
      const ref = doc(db, 'following', user?.uid);
      onSnapshot(ref, (doc) => {
        setFollowingIds(['']);
        doc
          ?.data()
          ?.users?.map((user: UserProps) =>
            setFollowingIds((prev: string[]) =>
              prev ? [...prev, user?.id] : [],
            ),
          );
      });
    }
  }, [user?.uid]);

  useEffect(() => {
    if (user) {
      let postsRef = collection(db, 'posts');
      let postQuery = query(postsRef, orderBy('createdAt', 'desc'));
      let followingQuery = query(
        postsRef,
        where('uid', 'in', followingIds),
        orderBy('createdAt', 'desc'),
      );

      onSnapshot(postQuery, (snapShot) => {
        let dataObj = snapShot.docs.map((doc) => ({
          ...doc.data(),
          id: doc?.id,
        }));
        setPosts(dataObj as PostProps[]);
      });

      onSnapshot(followingQuery, (snapShot) => {
        let dataObj = snapShot.docs.map((doc) => ({
          ...doc.data(),
          id: doc?.id,
        }));
        setFollowingPosts(dataObj as PostProps[]);
      });
    }
  }, [followingIds, user]);

  useEffect(() => {
    if (user?.uid) getFollowingIds();
  }, [getFollowingIds, user?.uid]);

  return (
    <>
      <header className="home">
        <h1 className="home__title">Home</h1>
        <nav className="home__tabs">
          <button
            className={`home__tab ${
              activeTab === 'all' && 'home__tab--active'
            }`}
            onClick={() => setActiveTab('all')}
          >
            전체
          </button>
          <button
            className={`home__tab ${
              activeTab === 'following' && 'home__tab--active'
            }`}
            onClick={() => {
              setActiveTab('following');
            }}
          >
            팔로잉
          </button>
        </nav>
      </header>
      <main>
        <PostForm />
        {activeTab === 'all' && (
          <div className="post">
            {posts?.length > 0 ? (
              posts?.map((post) => <PostBox post={post} key={post?.id} />)
            ) : (
              <div className="no-post">
                <p className="no-post__text">게시글이 없습니다.</p>
              </div>
            )}
          </div>
        )}
        {activeTab === 'following' && (
          <div className="post">
            {followingPosts?.length > 0 ? (
              followingPosts?.map((post) => (
                <PostBox post={post} key={post?.id} />
              ))
            ) : (
              <div className="no-post">
                <p className="no-post__text">게시글이 없습니다.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
};

export default HomePage;
