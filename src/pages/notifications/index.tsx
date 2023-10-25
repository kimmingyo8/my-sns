import NotificationBox from 'components/notifications/NotificationBox';
import AuthContext from 'context/AuthContext';
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { db } from 'firebaseApp';
import useTranslation from 'hooks/useTranslation';
import { useContext, useEffect, useState } from 'react';

export interface NotificationProps {
  id: string;
  uid: string;
  url: string;
  isRead: boolean;
  content: string;
  createdAt: string;
}
const NotificationsPage = () => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);
  const trans = useTranslation();

  useEffect(() => {
    if (user) {
      let ref = collection(db, 'notifications');
      let notificationQuery = query(
        ref,
        where('uid', '==', user?.uid),
        orderBy('createdAt'),
      );

      onSnapshot(notificationQuery, (snapShot) => {
        let dataObj = snapShot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        setNotifications(dataObj as NotificationProps[]);
      });
    }
  }, [user]);

  return (
    <>
      <header className="home">
        <h1 className="home__title">{trans('MENU_NOTI')}</h1>
      </header>
      <main className="post">
        {notifications?.length > 0 ? (
          <ul>
            {notifications?.map((noti) => (
              <NotificationBox notification={noti} key={noti.id} />
            ))}
          </ul>
        ) : (
          <div className="post__no-post">
            <p className="post__text">{trans('NO_NOTIFICATIONS')}</p>
          </div>
        )}
      </main>
    </>
  );
};

export default NotificationsPage;
