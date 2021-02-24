import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Box, Image } from 'rebass';

const DropDownBoxBlock = styled(Box)`
  border: 1px solid #616675;
  border-radius: 9999px;
  position: relative;
  display: flex;
  align-items: center;
  // width: 48px;
  // height: 48px;
  text-transform: capitalize;
`;

const DropDownList = styled(Box)`
  position: absolute;
  width: 163px;
  background: #fff;
  border: 1px solid #616675;
  right: 0;
  top: 59px;
  z-index: 1;
  border-radius: 3px;
  a:first-child {
    border-bottom: 1px solid #616675;
  }
`;

export default function Dropdown({imageUrl, children}) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

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
      onClick={() => toggleDropdown()}
    >
      <Box 
        sx={{ 
            width: '45px',
            height: '45px',
            objectFit: 'cover',
            cursor: 'pointer',
          }}
        >
        <Image
          src={(imageUrl) || ''}
          sx={{
            
            width: '100%',
            borderRadius: '50%',
            border: '1px solid black',
           
          }}
        />
      </Box>
      {isOpen && (
        <DropDownList>
          {children}
        </DropDownList>
      )}
    </DropDownBoxBlock>
  );
}
