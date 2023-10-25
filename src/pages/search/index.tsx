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
import useTranslation from 'hooks/useTranslation';
import { PostProps } from 'pages/home';
import { useContext, useEffect, useState } from 'react';

const SearchPage = () => {
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [tagQuery, setTagQuery] = useState<string>('');
  const { user } = useContext(AuthContext);
  const trans = useTranslation();

  const onChange = (e: any) => {
    setTagQuery(e?.target?.value?.trim());
  };

  useEffect(() => {
    if (user) {
      let postsRef = collection(db, 'posts');
      let postsQuery = query(
        postsRef,
        where('hashTags', 'array-contains-any', [tagQuery]),
        orderBy('createdAt', 'desc'),
      );

      onSnapshot(postsQuery, (snapShot) => {
        let dataObj = snapShot?.docs?.map((doc) => ({
          ...doc?.data(),
          id: doc?.id,
        }));
        setPosts(dataObj as PostProps[]);
      });
    }
  }, [tagQuery, user]);
  return (
    <>
      <header className="home__title">
        <h1 className="home__title-text">{trans('MENU_SEARCH')}</h1>
      </header>
      <main className="home">
        <div className="home__search-div">
          <input
            type="text"
            placeholder={trans('SEARCH_HASHTAGS')}
            className="home__search"
            onChange={onChange}
          />
        </div>
        <div className="post">
          {posts?.length > 0 ? (
            posts?.map((post) => <PostBox post={post} key={post?.id} />)
          ) : (
            <div className="no-post">
              <p className="no-post__text">{trans('NO_POSTS')}</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default SearchPage;
