import { doc, updateDoc } from 'firebase/firestore';
import { db } from 'firebaseApp';
import { NotificationProps } from 'pages/notifications';
import { useNavigate } from 'react-router-dom';
import styles from './Notification.module.scss';

const NotificationBox = ({
  notification,
}: {
  notification: NotificationProps;
}) => {
  const navigate = useNavigate();

  const onClickNotification = async (url: string) => {
    // isRead 업데이트
    const ref = doc(db, 'notifications', notification.id);
    await updateDoc(ref, {
      isRead: true,
    });
    // url로 이동
    navigate(url);
  };

  return (
    <li
      key={notification.id}
      className={styles.notification}
      onClick={() => onClickNotification(notification?.url)}
    >
      <div className={styles.notification__flex}>
        <p className={styles.notification__createdAt}>
          {notification?.createdAt}
        </p>
        {notification?.isRead === false && (
          <div className={styles.notification__unread} />
        )}
      </div>
      <p className={styles.notification__content}>{notification.content}</p>
    </li>
  );
};

export default NotificationBox;
