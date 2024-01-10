import { Button, useColorMode } from 'theme-ui';

import { Moon, Sun } from './Icons';

const ModeToggle = (props: any) => {
  const [mode, setMode] = useColorMode();
  return (
    <Button
      {...props}
      sx={{
        p: 0,
        bg: 'background',
        border: 0,
        mt: 0,
        svg: {
          fill: 'gray.500',
        },
      }}
      onClick={() => {
        const next = mode === 'dark' ? 'light' : 'dark';
        setMode(next);
      }}>
      {mode === 'dark' ? (
        <Sun width={22} height={22} />
      ) : (
        <Moon width={22} height={22} />
      )}
    </Button>
  );
};

export default ModeToggle;
