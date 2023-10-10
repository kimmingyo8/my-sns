import { useNavigate } from 'react-router-dom';
import { BsHouse } from 'react-icons/bs';
import { BiUserCircle } from 'react-icons/bi';
import { MdLogout } from 'react-icons/md';
import { getAuth, signOut } from 'firebase/auth';
import { app } from 'firebaseApp';
import { toast } from 'react-toastify';

const MenuList = () => {
  const navigate = useNavigate();
  return (
    <footer className="footer">
      <nav className="footer__nav">
        <button onClick={() => navigate('/')} type="button">
          <BsHouse />
          Home
        </button>
        <button onClick={() => navigate('/profile')} type="button">
          <BiUserCircle />
          Profile
        </button>
        <button
          onClick={async () => {
            const auth = getAuth(app);
            await signOut(auth);
            toast.success('로그아웃 되었습니다');
          }}
          type="button"
        >
          <MdLogout />
          Logout
        </button>
      </nav>
    </footer>
  );
};

export default MenuList;
