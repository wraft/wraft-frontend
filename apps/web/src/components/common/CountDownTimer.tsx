import React, { useState, useEffect } from 'react';
import { Box, Text } from 'theme-ui';

type Props = {
  setIsCounter?: any;
};

const CountdownTimer = ({ setIsCounter }: Props) => {
  const [minutes, setMinutes] = useState(2);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else {
        if (minutes === 0) {
          // Timer has reached 0:00, you can perform any action here
          clearInterval(intervalId);
          setIsCounter(false);
        } else {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }
    }, 1000);

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [minutes, seconds]);

  return (
    <Box>
      <Text variant="pR">{`${String(minutes).padStart(2, '0')}:${String(
        seconds,
      ).padStart(2, '0')}`}</Text>
    </Box>
  );
};

export default CountdownTimer;
