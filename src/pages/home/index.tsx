import PostBox from 'components/post/PostBox';
import PostForm from 'components/post/PostForm';
import AuthContext from 'context/AuthContext';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from 'firebaseApp';
import { useContext, useEffect, useState } from 'react';

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

const HomePage = () => {
  const [posts, setPosts] = useState<PostProps[]>([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      let postsRef = collection(db, 'posts');
      let postQuery = query(postsRef, orderBy('createdAt', 'desc'));

      onSnapshot(postQuery, (snapShot) => {
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
        <h1 className="home__title">Home</h1>
        <nav className="home__tabs">
          <button className="home__tab home__tab--active">게시글</button>
          <button className="home__tab">팔로잉</button>
        </nav>
      </header>
      <main>
        <PostForm />
        <div className="post">
          {posts?.length > 0 ? (
            posts?.map((post) => <PostBox post={post} key={post?.id} />)
          ) : (
            <div className="no-post">
              <p className="no-post__text">게시글이 없습니다.</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default HomePage;
