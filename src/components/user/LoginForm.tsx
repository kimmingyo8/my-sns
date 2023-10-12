import {
  GithubAuthProvider,
  GoogleAuthProvider,
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { app } from 'firebaseApp';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const LoginForm = () => {
  const [error, setError] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  const onSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const auth = getAuth(app);
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
      toast.success('성공적으로 로그인 되었습니다.');
    } catch (err: any) {
      toast.error(err?.code);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'email') {
      setEmail(value);
      const validRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      if (!validRegex.test(value)) {
        setError('이메일 형식이 올바르지 않습니다.');
      } else {
        setError('');
      }
    }
    if (name === 'password') {
      setPassword(value);
      if (value?.length < 8) {
        setError('비밀번호는 8자리 이상 입력해주세요.');
      } else {
        setError('');
      }
    }
  };

  const onClickSocialLogin = async (e: any) => {
    const { name } = e.target;

    let provider;
    const auth = getAuth(app);

    if (name === 'google') {
      provider = new GoogleAuthProvider();
    }
    if (name === 'github') {
      provider = new GithubAuthProvider();
    }

    await signInWithPopup(
      auth,
      provider as GithubAuthProvider | GoogleAuthProvider,
    )
      .then((result) => {
        console.log(result);
        toast.success('로그인 되었습니다.');
      })
      .catch((err) => {
        console.log(err);
        toast.error(err?.message);
      });
  };

  return (
    <>
      <header>
        <h1 className="form__title">로그인</h1>
      </header>
      <form className="form form--lg" onSubmit={onSubmit}>
        <div className="form__block">
          <label htmlFor="email">이메일</label>
          <input
            type="text"
            name="email"
            id="email"
            value={email}
            required
            onChange={onChange}
          />
        </div>
        <div className="form__block">
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            required
            onChange={onChange}
          />
        </div>
        {error && error?.length > 0 && (
          <div className="form__block">
            <p className="form__error">{error}</p>
          </div>
        )}
        <div className="form__block">
          계정이 없으신가요?
          <Link to="/users/signup" className="form__link">
            회원가입
          </Link>
        </div>
        <button
          type="submit"
          className="form__btn--submit"
          disabled={error?.length > 0}
        >
          로그인
        </button>
        <button
          type="button"
          name="google"
          className="form__btn--google"
          onClick={onClickSocialLogin}
        >
          Google로 로그인
        </button>
        <button
          type="button"
          name="github"
          className="form__btn--github"
          onClick={onClickSocialLogin}
        >
          Github으로 로그인
        </button>
      </form>
    </>
  );
};

export default LoginForm;
