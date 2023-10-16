import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from 'firebaseApp';
import { PostProps } from 'pages/home';
import { useCallback, useEffect, useState } from 'react';
import { FiImage } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const PostEditForm = () => {
  const params = useParams();
  const [post, setPost] = useState<PostProps | null>(null);
  const [content, setContent] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [hashTag, setHashTag] = useState<string>('');
  const navigate = useNavigate();

  const handleFileUpload = () => {};

  const getPost = useCallback(async () => {
    if (params.id) {
      const docRef = doc(db, 'posts', params.id);
      const docSnap = await getDoc(docRef);
      setPost({ ...(docSnap?.data() as PostProps), id: docSnap.id });
      setContent(docSnap?.data()?.content);
      setTags(docSnap?.data()?.hashTags);
    }
  }, [params.id]);

  const onSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (post) {
        const postRef = doc(db, 'posts', post?.id);
        await updateDoc(postRef, {
          content: content,
          hashTags: tags,
        });
        navigate(`posts/${post?.id}`);
        toast.success('게시글을 수정했습니다.');
      }
    } catch (e: any) {
      console.log(e);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'content') {
      setContent(value);
    }
  };

  const onChangeHashTag = (e: any) => {
    setHashTag(e?.target?.value?.trim());
  };

  const handleKeyUp = (e: any) => {
    if (e.keyCode === 32 && e.target.value.trim() !== '') {
      e.preventDefault();
      // 만약 같은 태그가 있다면 에러를 띄운다.
      // 아니면 태그를 생성해 준다.
      if (tags?.includes(e.target.value?.trim())) {
        toast.error('같은 태그가 있습니다.');
      } else {
        setTags((prev) => (prev?.length > 0 ? [...prev, hashTag] : [hashTag]));
        setHashTag('');
      }
    }
    return false;
  };

  const removeTag = (tag: string) => {
    setTags(tags?.filter((val) => val !== tag));
  };

  useEffect(() => {
    if (params.id) getPost();
  }, [getPost, params.id]);

  return (
    <form className="post-form" onSubmit={onSubmit}>
      <textarea
        className="post-form__textarea"
        name="content"
        id="content"
        placeholder="오늘 하루를 기록하세요!"
        onChange={onChange}
        value={content}
      />
      <div className="post-form__hashtags">
        <span className="post-form__hashtags-outputs">
          {tags?.map((tag, index) => (
            <button
              type="button"
              className="post-form__hashtags-tag"
              key={index}
              onClick={() => removeTag(tag)}
            >
              #{tag}
            </button>
          ))}
        </span>
        <label className="txt-hide" htmlFor="hashtag">
          해시태그 입력
        </label>
        <input
          type="text"
          className="post-form__hashtags-input"
          name="hashtag"
          id="hashtag"
          placeholder="해시태그 + 스페이스바 입력"
          onChange={onChangeHashTag}
          onKeyUp={handleKeyUp}
          value={hashTag}
        />
      </div>
      <div className="post-form__submit">
        <label htmlFor="file-input" className="post-form__file">
          <FiImage className="post-form__file-icon" />
        </label>
        <input
          type="file"
          name="file-input"
          id="file-input"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        <button className="post-form__submit-btn">수정</button>
      </div>
    </form>
  );
};

export default PostEditForm;
