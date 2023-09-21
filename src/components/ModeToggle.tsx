import { Button, useColorMode } from 'theme-ui';

import { Moon, Sun } from '@styled-icons/boxicons-regular';

const ModeToggle = (props: any) => {
  const [mode, setMode] = useColorMode();
  return (
    <Button
      {...props}
      sx={{
        p: 0,
        bg: 'background',
        border: 0,
        svg: {
          fill: 'gray.5',
        },
      }}
      onClick={() => {
        const next = mode === 'dark' ? 'light' : 'dark';
        setMode(next);
      }}>
      {mode === 'dark' ? <Sun width={22} /> : <Moon width={22} />}
    </Button>
  );
};

export default ModeToggle;
