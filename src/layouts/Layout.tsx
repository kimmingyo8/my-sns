import MenuList from 'components/Menu';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="layout">
      {children}
      <MenuList />
    </div>
  );
};

export default Layout;
