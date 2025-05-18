import { Moon, Sun } from '@phosphor-icons/react';
import { Button } from '@wraft/ui';
import { useColorMode } from 'theme-ui';

const ModeToggle = (props: any) => {
  const [mode, setMode] = useColorMode();
  return (
    <Button
      {...props}
      p="0"
      variant="ghost"
      size="sm"
      onClick={() => {
        const next = mode === 'dark' ? 'light' : 'dark';
        setMode(next);
      }}>
      {mode === 'dark' ? <Moon size={16} /> : <Sun width={16} />}
    </Button>
  );
};

export default ModeToggle;
