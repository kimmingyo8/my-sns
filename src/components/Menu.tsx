import { useNavigate } from 'react-router-dom';
import { BsHouse } from 'react-icons/bs';
import { BiUserCircle } from 'react-icons/bi';
import { MdLogin, MdLogout } from 'react-icons/md';
import { getAuth, signOut } from 'firebase/auth';
import { app } from 'firebaseApp';
import { toast } from 'react-toastify';
import { AiOutlineSearch } from 'react-icons/ai';
import { IoMdNotificationsOutline } from 'react-icons/io';
import useTranslation from 'hooks/useTranslation';
import AuthContext from 'context/AuthContext';
import { useContext } from 'react';

const MenuList = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const trans = useTranslation();

  return (
    <footer className="footer">
      <nav className="footer__nav">
        <button onClick={() => navigate('/')} type="button">
          <BsHouse />
          <span className="footer__nav-txt">{trans('MENU_HOME')}</span>
        </button>
        <button type="button" onClick={() => navigate('/profile')}>
          <BiUserCircle />
          <span className="footer__nav-txt">{trans('MENU_PROFILE')}</span>
        </button>
        <button type="button" onClick={() => navigate('/search')}>
          <AiOutlineSearch />
          <span className="footer__nav-txt"> {trans('MENU_SEARCH')}</span>
        </button>
        <button type="button" onClick={() => navigate('/notifications')}>
          <IoMdNotificationsOutline />
          <span className="footer__nav-txt">{trans('MENU_NOTI')}</span>
        </button>
        {user === null ? (
          <button type="button" onClick={() => navigate('/users/login')}>
            <MdLogin />
            <span className="footer__nav-txt">{trans('MENU_LOGIN')}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={async () => {
              const auth = getAuth(app);
              await signOut(auth);
              toast.success('로그아웃 되었습니다.');
            }}
          >
            <MdLogout />
            <span className="footer__nav-txt">{trans('MENU_LOGOUT')}</span>
          </button>
        )}
      </nav>
    </footer>
  );
};

export default MenuList;
