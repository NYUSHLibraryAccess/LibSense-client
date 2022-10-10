import { useMemo } from 'react';

import { useAppSelector } from '@/store';
import { useHour } from '@/hooks/useHour';
import NightSvg from '@/assets/night.svg';
import SunriseSvg from '@/assets/sunrise.svg';
import SunsetSvg from '@/assets/sunset.svg';

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
      return <SunriseSvg />;
    } else if (16 <= hour && hour < 18) {
      return <SunsetSvg />;
    } else {
      return <NightSvg />;
    }
  }, [hour]);

  return { message, icon };
};

export { useGreetingCard };
