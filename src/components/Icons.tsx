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
import plus from './icon/plus.svg'
import file from './icon/file.svg'
import field from './icon/box.svg'
import food from './icon/food.svg'
import userno from './icon/userno.svg'

import abstract from "./icon/abstract.svg";

import { Image } from 'rebass';
import styled from '@emotion/styled';
// import { Box } from 'rebass';
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
    height 38px;
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
    <Image src={flow}/>
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
    <Image className="y" src={logo} width="50px" ml={2}/>
  </IconBox>
);

export const FoodIcon = () => (
  <IconBox>
    <Image className="ico" src={food} width="24px" height="24px"/>
  </IconBox>
)
export const Abstract = () => (
  <Image className="x" src={abstract} width="100" />  
)

export const UserIcon = () => (
  <Image className="x" src={userno} width="32" />  
)

