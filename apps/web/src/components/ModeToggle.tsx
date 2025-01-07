import { Moon, Sun } from '@phosphor-icons/react';
import { Button, useColorMode } from 'theme-ui';

const ModeToggle = (props: any) => {
  const [mode, setMode] = useColorMode();
  return (
    <Button
      {...props}
      sx={{
        p: 0,
        bg: 'transparent',
        border: 0,
        mt: 0,
        svg: {
          fill: 'gray.900',
        },
      }}
      onClick={() => {
        const next = mode === 'dark' ? 'light' : 'dark';
        setMode(next);
      }}>
      {mode === 'dark' ? <Moon size={20} /> : <Sun width={20} />}
    </Button>
  );
};

export default ModeToggle;
