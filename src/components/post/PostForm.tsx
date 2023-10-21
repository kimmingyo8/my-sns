import AuthContext from 'context/AuthContext';
import { addDoc, collection } from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { db, storage } from 'firebaseApp';
import { useContext, useState } from 'react';
import { FiImage } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

const PostForm = () => {
  const [content, setContent] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [hashTag, setHashTag] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<string | null>(null);
  const { user } = useContext(AuthContext);

  const handleFileUpload = (e: any) => {
    const { files } = e.target;

    const file = files?.[0];
    const fileReader = new FileReader();
    fileReader?.readAsDataURL(file);

    fileReader.onloadend = (e: any) => {
      const { result } = e?.currentTarget;
      setImageFile(result);
    };
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);

    const key = `${user?.uid}/${uuidv4()}`;
    const storageRef = ref(storage, key);
    try {
      // 이미지 먼저 업로드
      let imageUrl = '';
      if (imageFile) {
        const data = await uploadString(storageRef, imageFile, 'data_url');
        imageUrl = await getDownloadURL(data?.ref);
      }
      // 업로드된 이미지의 download URL 업데이트
      await addDoc(collection(db, 'posts'), {
        content: content,
        createdAt: new Date()?.toLocaleDateString('ko', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
        uid: user?.uid,
        email: user?.email,
        hashTags: tags,
        imageUrl: imageUrl,
      });
      setTags([]);
      setHashTag('');
      setContent('');
      setImageFile('');
      toast.success('게시글을 생성했습니다.');
      setIsSubmitting(false);
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
    if (
      (e.keyCode === 32 || e.key === 'Enter') &&
      e.target.value.trim() !== ''
    ) {
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

  const handleDeleteImage = () => {
    setImageFile(null);
  };

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
          className="post-form__input"
          name="hashtag"
          id="hashtag"
          placeholder="해시태그 + 스페이스바 입력"
          onChange={onChangeHashTag}
          onKeyUp={handleKeyUp}
          value={hashTag}
        />
      </div>
      <div className="post-form__submit">
        <div className="post-form__image-area">
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
          {imageFile && (
            <div className="post-form__attachment">
              <img src={imageFile} alt="attachment" width={100} height={100} />
              <button
                className="post-form__clear-btn"
                type="button"
                onClick={handleDeleteImage}
              >
                삭제
              </button>
            </div>
          )}
        </div>
        <button className="post-form__submit-btn" disabled={isSubmitting}>
          작성
        </button>
      </div>
    </form>
  );
};

export default PostForm;
