import PostHeader from 'components/post/PostHeader';
import AuthContext from 'context/AuthContext';
import { updateProfile } from 'firebase/auth';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadString,
} from 'firebase/storage';
import { storage } from 'firebaseApp';
import { useContext, useEffect, useState } from 'react';
import { FiImage } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

const ProfileEditPage = () => {
  const [displayName, setDisplayName] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const STORAGE_DOWNLOAD_URL_STR = 'https://firebasestorage.googleapis.com';

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setDisplayName(value);
  };

  const handleFileUpload = (e: any) => {
    const { files } = e.target;

    const file = files?.[0];
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onloadend = (e: any) => {
      const { result } = e?.currentTarget;
      setImageUrl(result);
    };
  };

  const handleDeleteImage = () => {
    setImageUrl(null);
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    let key = `${user?.uid}/${uuidv4()}`;
    const storageRef = ref(storage, key);
    let newImageUrl = null;
    try {
      // 기존 유저 이미지가 Firebase storage 이미지일 경우만 삭제
      if (
        user?.photoURL &&
        user?.photoURL?.includes(STORAGE_DOWNLOAD_URL_STR)
      ) {
        const imageRef = ref(storage, user?.photoURL);
        if (imageRef) {
          await deleteObject(imageRef).catch((err) => console.log(err));
        }
      }
      // 이미지 업로드
      if (imageUrl) {
        const data = await uploadString(storageRef, imageUrl, 'data_url');
        newImageUrl = await getDownloadURL(data?.ref);
      }
      // updateProfile 호출
      if (user) {
        await updateProfile(user, {
          displayName: displayName || '',
          photoURL: newImageUrl || '',
        })
          .then(() => {
            toast.success('프로필이 잘 업데이트 되었습니다.');
            navigate('/profile');
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } catch (e: any) {
      console.log(e);
    }
  };

  useEffect(() => {
    console.log(user);
    if (user?.photoURL) {
      setImageUrl(user?.photoURL);
    }

    if (user?.displayName) {
      setDisplayName(user?.displayName);
    }
  }, [user, user?.photoURL]);

  return (
    <>
      <PostHeader />
      <main className="post">
        <form className="post-form" onSubmit={onSubmit}>
          <div className="post-form__profile">
            <div className="post-form__attachment">
              {imageUrl && (
                <>
                  <img
                    src={imageUrl}
                    alt="attachment"
                    width={100}
                    height={100}
                  />
                  <button
                    type="button"
                    onClick={handleDeleteImage}
                    className="post-form__clear-btn"
                  >
                    삭제
                  </button>
                </>
              )}
            </div>
            <input
              type="text"
              name="displayName"
              placeholder="이름"
              onChange={onChange}
              className="post-form__input"
              value={displayName}
            />
          </div>

          <div className="post-form__submit-area">
            <div className="post-form__image-area">
              <label htmlFor="file-input" className="post-form__file">
                <FiImage className="post-form__file-icon" />
              </label>
            </div>
            <input
              type="file"
              accept="image/*"
              name="file-input"
              id="file-input"
              className="hidden"
              onChange={handleFileUpload}
            />
            <button className="post-form__submit-btn">프로필 수정</button>
          </div>
        </form>
      </main>
    </>
  );
};

export default ProfileEditPage;
