import React from 'react';

// import book from './icon/book-opened.svg';
import layout from './icon/extension.svg';
import grid from './icon/grid-alt.svg';
import templates from './icon/grid-small.svg';
import content from './icon/sticker.svg';
import flow from './icon/bolt.svg';
import del from './icon/bin.svg';
import edit from './icon/edit.svg';
import logo from './icon/logo-white.svg';
import user from './icon/user.svg';
import plus from './icon/plus.svg';
import file from './icon/file.svg';
import field from './icon/box.svg';
import food from './icon/food.svg';
import userno from './icon/userno.svg';

import abstract from './icon/abstract.svg';

import { Image } from 'theme-ui';
import styled from '@emotion/styled';
// import { Box } from 'theme-ui';
// import book from './icon/book-opened.svg';

const IconBox = styled.div`
  img {
    width: 24px;
    height: 24px;
    margin-right: 16px;
  }
  img.x {
    width: auto;
    height 24px;
  }
  img.y {
    width: auto;
    height 24px;
  }
  img.clean{
    padding:0;
  }
  img.ico{
    width: auto;
    height 24px;
    margin:0;
    magin-top: -1px;
  }
`;

export const Book = () => (
  <IconBox>
    <Image src={content} />
  </IconBox>
);

export const Layout = () => (
  <IconBox>
    <Image src={grid} />
  </IconBox>
);

export const ContentType = () => (
  <IconBox>
    <Image src={layout} />
  </IconBox>
);

export const Template = () => (
  <IconBox>
    <Image src={templates} />
  </IconBox>
);

export const Flow = () => (
  <IconBox>
    <Image src={flow} />
  </IconBox>
);

export const Del = () => (
  <IconBox>
    <Image src={del} />
  </IconBox>
);

export const Edit = () => (
  <IconBox>
    <Image src={edit} />
  </IconBox>
);

export const File = () => (
  <IconBox>
    <Image src={file} />
  </IconBox>
);

export const Plus = () => (
  <IconBox>
    <Image src={plus} />
  </IconBox>
);

export const User = () => (
  <IconBox>
    <Image src={user} />
  </IconBox>
);

export const FieldIcon = () => (
  <IconBox>
    <Image src={field} />
  </IconBox>
);

export const Logo = () => (
  <IconBox>
    <Image className="y" src={logo} width="50px" ml={2} />
  </IconBox>
);

export const FoodIcon = () => (
  <IconBox>
    <Image className="ico" src={food} width="24px" height="24px" />
  </IconBox>
);
export const Abstract = () => (
  <Image className="x" src={abstract} width="100" />
);

export const UserIcon = () => <Image className="x" src={userno} width="32" />;

export const ErrorIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M24 4C12.96 4 4 12.95 4 24s8.96 20 20 20 20-8.95 20-20S35.04 4 24 4zm2 30h-4v-4h4v4zm0-8h-4V14h4v12z" />
    </svg>
  );
};

export const TickIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg fill="none" viewBox="0 0 15 15" height="1em" width="1em" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M0 7.5a7.5 7.5 0 1115 0 7.5 7.5 0 01-15 0zm7.072 3.21l4.318-5.398-.78-.624-3.682 4.601L4.32 7.116l-.64.768 3.392 2.827z"
        clipRule="evenodd"
      />
    </svg>
  );
};

export const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M21.71 20.29L18 16.61A9 9 0 1016.61 18l3.68 3.68a1 1 0 001.42 0 1 1 0 000-1.39zM11 18a7 7 0 117-7 7 7 0 01-7 7z" />
    </svg>
  );
};

export const BrandLogo = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 115.92 36.37"
      color="inherit"
      fill="inherit"
      height="1em"
      width="1em"
      {...props}
    >
      <path
        color="inherit"
        d="M39.52 23.51l-.22 1.62h-.25l-.26-1.62-3.36-13.29h-4.94l-3.33 13.25-.21 1.15-.25-.05-.13-1.06-2.68-13.29h-6.05l5.41 21.3h6.51l3.07-11.63h.25l3.07 11.63h6.82l5.45-21.3h-6.09l-2.81 13.29zm18.56-11.07l-.25-.09v-2.13h-5.92v21.34h5.92V17.12a6.92 6.92 0 014.72-1.87h.86V9.8h-.51a6.19 6.19 0 00-4.82 2.64zm20.15-.86l-.26.09a6.52 6.52 0 00-4.85-1.87c-5.24 0-8.44 4.89-8.44 11.07s3.07 11.07 8 11.07A6.36 6.36 0 0078 29.43l.26.08v2h5.92V10.22h-5.95zm0 12.61a4.5 4.5 0 01-4.39 2.94c-2.26 0-3.24-2.64-3.24-6.26s1-6.22 3.24-6.22a6.73 6.73 0 014.39 1.49zM99.14 4.86a9.17 9.17 0 012.89.46l.73-4.43A10.27 10.27 0 0098.37 0c-4.73 0-7.75 3.28-7.75 8.3v1.92h-2.94v4.52h2.94v16.78h5.92V14.74h4v-4.52h-4V8.3c0-2.38.89-3.44 2.6-3.44zm16.05 21.33a5.37 5.37 0 01-2.17.43c-1.28 0-2.17-.9-2.17-3v-8.88h4.3v-4.52h-4.3V3.41H105v6.81h-2.64v4.52H105v9.15c0 5 2.94 7.84 6.94 7.84a8.39 8.39 0 004-.9zM0 31.68h16.83v4.69H0z"
      />
    </svg>
  );
};

export const LayoutLogo = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 100 100"
      color="inherit"
      fill="inherit"
      height="3.5em"
      width="3.5em"
      {...props}
    >
      <path d="M14 14v72h72V14H14zm70 2v9.85H16V16h68zM16 27.85h22.5V84H16V27.85zM40.5 84V27.85H84V84H40.5z" />
      <path d="M47.98 39.44h29.48v2H47.98zM47.98 51.15h29.48v2H47.98z" />
    </svg>
  );
};

export const FlowLogo = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 100 100"
      color="inherit"
      fill="inherit"
      height="3.5em"
      width="3.5em"
      {...props}
    >
      <path d="M85.25 71.22a23.16 23.16 0 00-23-21.28H51.8V28.85a12 12 0 10-4-.06v21.15h-10a23.16 23.16 0 00-23 21.28 12 12 0 104-.07 19.16 19.16 0 0119-17.21h10v17.27a12 12 0 104-.06V53.94h10.4a19.16 19.16 0 0119 17.21 12 12 0 104 .07zM42 17a8 8 0 118 8 8 8 0 01-8-8zM25 83a8 8 0 11-8-8 8 8 0 018 8zm33 0a8 8 0 11-8-8 8 8 0 018 8zm25 8a8 8 0 118-8 8 8 0 01-8 8z" />
    </svg>
  );
};

export const ThemeLogo = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 100 100"
      color="inherit"
      fill="inherit"
      height="4rem"
      width="4rem"
      {...props}
    >
      <path
        d="M49.63 14.82c-1.9.04-3.72 1.01-4.73 2.75l-4.38 7.5a1.6 1.6 0 002.78 1.63l4.35-7.52a2.37 2.37 0 013.3-.86c1.2.7 1.6 2.1.92 3.25l-1.3 2.28a1.6 1.6 0 00.58 2.2L54 27.68a1.6 1.6 0 002.17-.58l4.25-7.33a3.25 3.25 0 014.48-1.14l.27.14a3.18 3.18 0 011.23 4.4l-4.25 7.33a1.6 1.6 0 00.58 2.2l3 1.72a1.6 1.6 0 002.17-.6l1.92-3.32a1.81 1.81 0 012.5-.7c.87.5 1.16 1.56.63 2.47l-4.98 8.58a1.6 1.6 0 102.75 1.6l4.98-8.58a5.01 5.01 0 00-1.8-6.84 5.03 5.03 0 00-6.83 1.87l-1.14 1.95-.23-.13 3.45-5.92a6.47 6.47 0 00-2.4-8.8l-.28-.15a6.46 6.46 0 00-8.8 2.33l-3.45 5.95-.07-.05.5-.88a5.62 5.62 0 00-5.02-8.38zm-13.98 13.6a4.37 4.37 0 00-3.42 2.15l-4.2 7.2a4.29 4.29 0 001.54 5.85l30.5 17.53a4.35 4.35 0 005.88-1.6l4.17-7.2a4.32 4.32 0 00-1.55-5.88L38.1 28.98a4.23 4.23 0 00-2.45-.54zm.23 3.18a1 1 0 01.6.15l30.5 17.5c.53.3.7.96.37 1.52l-4.17 7.2c-.33.57-.97.71-1.5.4L31.2 40.88c-.53-.3-.73-.93-.4-1.5l4.2-7.2c.2-.35.53-.54.88-.57zM71.1 56.67a1.6 1.6 0 00-.67 3l1.1.63-4.03 6.9-26.23-9.3a1.6 1.6 0 00-1.92.73l-1.5 2.57-3.58-2.05a1.6 1.6 0 00-2.17.6l-.8 1.35a1.6 1.6 0 00-.13 1.27l.13.43v.03c.25.77.1 2.67-.23 3.3l-7.3 14.12a1.6 1.6 0 00.58 2.08l2.2 1.4.13.07L29 85a1.6 1.6 0 002.07-.55l8.66-13.33a6.43 6.43 0 012.8-1.87l.42-.1a1.6 1.6 0 001.02-.75l.8-1.35a1.6 1.6 0 00-.6-2.2l-3.55-2.05.83-1.42 26.25 9.27a1.6 1.6 0 001.9-.7l5.48-9.43a1.6 1.6 0 00-.58-2.2L72 56.9a1.6 1.6 0 00-.9-.23zm-36.62 6.3l3.15 1.8 3.14 1.8a7.49 7.49 0 00-3.75 2.8L29.17 81.5l-.9-.47-.97-.6 6.62-12.83c.74-1.41.82-3.05.55-4.62z"
        fill="inherit"
      />
    </svg>
  );
};

export const PermLogo = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 100 100"
      color="inherit"
      fill="inherit"
      height="3rem"
      width="3rem"
      {...props}
    >
      <path d="M50 6c-12.66 0-23.22 8.6-23.22 19.72V39H21a2 2 0 00-.19 0A2 2 0 0019 41v26.75C19 82.45 33.04 94 50 94s31-11.55 31-26.25V41a2 2 0 00-2-2h-5.78V25.72C73.22 14.6 62.66 6 50 6zm0 4c10.86 0 19.22 7.18 19.22 15.72V39H30.78V25.72C30.78 17.18 39.14 10 50 10zM23 43h54v24.75C77 79.88 65.16 90 50 90S23 79.88 23 67.75V43zm27 10.44a8.18 8.18 0 00-8.16 8.15c0 3.8 2.64 7 6.16 7.91v5.16a2 2 0 104 0V69.5a8.2 8.2 0 006.16-7.9c0-4.5-3.68-8.16-8.16-8.16zm0 4a4.12 4.12 0 014.16 4.15A4.15 4.15 0 0150 65.8a4.15 4.15 0 01-4.16-4.2A4.12 4.12 0 0150 57.44z" />
    </svg>
  );
};

export const NotifIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path
        fill="currentColor"
        d="M24 44c2.21 0 4-1.79 4-4h-8c0 2.21 1.79 4 4 4zm12-12V22c0-6.15-3.27-11.28-9-12.64V8c0-1.66-1.34-3-3-3s-3 1.34-3 3v1.36c-5.73 1.36-9 6.49-9 12.64v10l-4 4v2h32v-2l-4-4z"
      />
    </svg>
  );
};

export const EmptyForm = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 752 752"
      fill="currentColor"
      height="6rem"
      width="auto"
      {...props}
    >
      <path
        fill="currentColor"
        d="M489.66 281.29v-1.422c-.473-2.367-1.895-3.789-3.79-5.21-4.26-4.735-13.733-14.208-33.624-34.099l-36.465-36.465h-.473c-.472 0-.472-.472-.945-.472h-.473c-.472 0-.472 0-.945-.473H269.453c-3.789 0-7.105 3.316-7.105 7.105v331.51c0 2.84 1.421 5.211 4.261 6.63 2.367.945 5.684.472 7.578-.946l16.574-15.16 16.574 14.68c2.84 2.367 6.63 2.367 9.473 0l16.574-14.68 16.574 14.68c2.84 2.367 6.629 2.367 9.473 0l16.574-14.68 16.574 14.68c2.84 2.367 6.629 2.367 9.472 0l16.578-14.68 16.574 14.68c2.84 2.367 6.63 2.367 9.473 0l16.574-14.68 16.574 14.68c1.422.945 2.84 1.894 4.735 1.894.945 0 1.894 0 2.84-.472 2.367-.945 4.261-3.79 4.261-6.63zm-24.152-7.106h-46.883v-46.883c13.258 13.263 33.621 33.626 46.883 46.884zm.473 243.42c-2.84-2.367-6.63-2.367-9.473 0l-16.574 14.68-16.574-14.68c-2.84-2.367-6.629-2.367-9.473 0l-16.574 14.68-16.574-14.68c-2.84-2.367-6.629-2.367-9.472 0l-16.574 14.68-16.578-14.68c-2.84-2.367-6.63-2.367-9.473 0l-16.574 14.68-16.574-14.68c-1.422-1.421-2.84-1.894-4.735-1.894-1.894 0-3.316.473-4.734 1.895l-9.473 8.523v-308.77h127.87v63.934c0 3.789 3.317 7.105 7.106 7.105h63.93v237.74zm-11.84-32.676c0 3.79-3.317 7.106-7.106 7.106l-142.07-.004c-3.789 0-7.105-3.316-7.105-7.105s3.316-7.106 7.105-7.106h142.07c3.79.004 7.102 3.32 7.102 7.11z"
      />
    </svg>
  );
};

export default NotifIcon;
