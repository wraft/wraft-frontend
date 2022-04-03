import { Button, useColorMode } from "theme-ui";

import { Moon, Sun } from '@styled-icons/boxicons-regular';

const IconMode = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="inherit"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M13.51 9.69L9.93 6.1 7.1 8.93l3.59 3.59 2.82-2.83zM8 21H2v4h6v-4zM26 1.1h-4V7h4V1.1zm14.9 7.83L38.07 6.1l-3.59 3.59 2.83 2.83 3.59-3.59zm-6.41 27.38l3.59 3.59 2.83-2.83-3.59-3.59-2.83 2.83zM40 21v4h6v-4h-6zM24 11c-6.63 0-12 5.37-12 12s5.37 12 12 12 12-5.37 12-12-5.37-12-12-12zm-2 33.9h4V39h-4v5.9zM7.1 37.07l2.83 2.83 3.59-3.59-2.83-2.83-3.59 3.59z" />
    </svg>
  );
}

const ModeToggle = (props: any) => {
  const [mode, setMode] = useColorMode();
  return (
    <Button      
      {...props}
      sx={{
        p: 0,
        bg: 'gray.0',
        // borderColor: 'gray.1',
        svg: {
          fill: 'gray.8'
        }
      }}
      onClick={() => {
        const next = mode === "dark" ? "light" : "dark";
        setMode(next);
      }}
    >

{mode === "dark" ? <Sun width={22}/> : <Moon width={22}/> }
      
      {/* <IconMode /> */}
    </Button>
  );
};

export default ModeToggle;