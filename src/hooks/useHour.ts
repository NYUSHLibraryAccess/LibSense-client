import { useEffect, useState } from 'react';

const useHour = (interval = 10000) => {
  const [hour, setHour] = useState<number>(null);

  useEffect(() => {
    setHour(new Date().getHours());
    const id = setInterval(() => {
      setHour(new Date().getHours());
    }, interval);
    return () => {
      clearInterval(id);
    };
  }, []);

  return hour;
};

export { useHour };
