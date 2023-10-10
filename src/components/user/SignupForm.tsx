import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { app } from 'firebaseApp';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const SignupForm = () => {
  const [error, setError] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirm, setPasswordConfirm] = useState<string>('');
  const navigate = useNavigate();

  const onSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const auth = getAuth(app);
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/');
      toast.success('성공적으로 회원가입 되었습니다.');
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
      } else if (value !== password) {
        setError('비밀번호와 비밀번호 확인 값이 다릅니다.');
      } else {
        setError('');
      }
    }
    if (name === 'password_confirm') {
      setPasswordConfirm(value);
      if (value?.length < 8) {
        setError('비밀번호는 8자리 이상 입력해주세요.');
      } else if (value !== password) {
        setError('비밀번호와 비밀번호 확인 값이 다릅니다.');
      } else {
        setError('');
      }
    }
  };

  return (
    <form className="form form--lg" onSubmit={onSubmit}>
      <h1 className="form__title">회원가입</h1>
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
      <div className="form__block">
        <label htmlFor="password_confirm">비밀번호 확인</label>
        <input
          type="password"
          name="password_confirm"
          id="password_confirm"
          value={passwordConfirm}
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
        계정이 있으신가요?
        <Link to="/login" className="form__link">
          로그인하기
        </Link>
      </div>
      <button
        type="submit"
        className="form__btn--submit"
        disabled={error?.length > 0}
      >
        회원가입
      </button>
    </form>
  );
};

export default SignupForm;
