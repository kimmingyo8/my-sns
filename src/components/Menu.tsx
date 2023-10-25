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
          {trans('MENU_HOME')}
        </button>
        <button type="button" onClick={() => navigate('/profile')}>
          <BiUserCircle />
          {trans('MENU_PROFILE')}
        </button>
        <button type="button" onClick={() => navigate('/search')}>
          <AiOutlineSearch />
          {trans('MENU_SEARCH')}
        </button>
        <button type="button" onClick={() => navigate('/notifications')}>
          <IoMdNotificationsOutline />
          {trans('MENU_NOTI')}
        </button>
        {user === null ? (
          <button type="button" onClick={() => navigate('/users/login')}>
            <MdLogin />
            {trans('MENU_LOGIN')}
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
            {trans('MENU_LOGOUT')}
          </button>
        )}
      </nav>
    </footer>
  );
};

export default MenuList;
