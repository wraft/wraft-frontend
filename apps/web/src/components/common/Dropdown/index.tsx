import React, { FC, useRef, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Box, Image } from 'theme-ui';

const DropDownBoxBlock = styled(Box)`
  border: 0;
  border-radius: 9999px;
  position: relative;
  display: flex;
  align-items: center;
  text-transform: capitalize;
`;

const DropDownList = styled(Box)`
  position: absolute;
  width: 163px;
  border: 0;
  background: #fff;
  right: 0;
  top: 59px;
  z-index: 1;
  border-radius: 3px;
  a:first-child {
    border-bottom: 1px solid #616675;
  }
`;

interface Props {
  children?: any;
  imageUrl: string;
}

const Dropdown: FC<Props> = ({ imageUrl, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <DropDownBoxBlock
      ml="14px"
      ref={wrapperRef}
      onClick={() => toggleDropdown()}>
      <Box
        sx={{
          width: '32px',
          height: '32px',
          objectFit: 'cover',
          cursor: 'pointer',
        }}>
        <Image
          src={imageUrl || ''}
          alt=""
          sx={{
            width: '100%',
            borderRadius: '50%',
            border: '1px solid',
            borderColor: 'border',
          }}
        />
      </Box>
      {isOpen && <DropDownList>{children}</DropDownList>}
    </DropDownBoxBlock>
  );
};

export default Dropdown;
