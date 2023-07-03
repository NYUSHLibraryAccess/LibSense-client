import { useMemo } from 'react';

import { useAppSelector } from '@/store';
import { useHour } from '@/hooks/useHour';
import afternoonImg from '@/assets/banner-afternoon.png';
import morningImg from '@/assets/banner-morning.png';
import nightImg from '@/assets/banner-night.png';

const useGreetingCard = () => {
  const { username } = useAppSelector((state) => state.auth);
  const hour = useHour();

  const message = useMemo(() => {
    if (5 <= hour && hour < 12) {
      return `Good morning, ${username || '-'}.`;
    } else if (12 <= hour && hour < 17) {
      return `Good afternoon, ${username || '-'}.`;
    } else if (17 <= hour && hour < 23) {
      return `Good afternoon, ${username || '-'}.`;
    } else {
      return `Hava a nice day, ${username || '-'}.`;
    }
  }, [username, hour]);
  const icon = useMemo(() => {
    if (5 <= hour && hour < 16) {
      return <img src={morningImg} />;
    } else if (16 <= hour && hour < 18) {
      return <img src={afternoonImg} />;
    } else {
      return <img src={nightImg} />;
    }
  }, [hour]);

  return { message, icon };
};

export { useGreetingCard };
