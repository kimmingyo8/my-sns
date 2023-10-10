import MenuList from 'components/Menu';
import AuthContext from 'context/AuthContext';
import { ReactNode, useContext } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user } = useContext(AuthContext);
  return (
    <div className="layout">
      {children}
      {user !== null && <MenuList />}
    </div>
  );
};

export default Layout;
