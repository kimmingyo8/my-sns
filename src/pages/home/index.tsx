import PostBox from 'components/PostBox';
import PostForm from 'components/PostForm';

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
}

const posts: PostProps[] = [
  {
    id: '1',
    email: 'test@test.com',
    content: '내용입니다',
    createdAt: '2023-08-30',
    uid: '123123',
  },
  {
    id: '2',
    email: 'test@test.com',
    content: '내용입니다',
    createdAt: '2023-08-30',
    uid: '123123',
  },
  {
    id: '3',
    email: 'test@test.com',
    content: '내용입니다',
    createdAt: '2023-08-30',
    uid: '123123',
  },
  {
    id: '4',
    email: 'test@test.com',
    content: '내용입니다',
    createdAt: '2023-08-30',
    uid: '123123',
  },
  {
    id: '5',
    email: 'test@test.com',
    content: '내용입니다',
    createdAt: '2023-08-30',
    uid: '123123',
  },
  {
    id: '6',
    email: 'test@test.com',
    content: '내용입니다',
    createdAt: '2023-08-30',
    uid: '123123',
  },
];

const HomePage = () => {
  return (
    <main>
      <h1 className="home__title">Home</h1>
      <ul className="home__tabs">
        <li className="home__tab home__tab--active">게시글</li>
        <li className="home__tab">팔로잉</li>
      </ul>
      <PostForm />
      {/* posts */}
      <ul className="post">
        {posts?.map((post) => (
          <PostBox post={post} key={post?.id} />
        ))}
      </ul>
    </main>
  );
};

export default HomePage;
