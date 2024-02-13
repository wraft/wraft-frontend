import React from 'react'
import styled, { th, x, css, right } from '@xstyled/emotion';

import * as S from './styles'

export const Title: React.FC<any> = ({ children, zIndex = '1', ...props }) => {
  return (
    <S.Title
      alignItems="center"
      display="flex"
      justifyContent="space-between"
      position={{ xs: 'sticky', md: 'static' }}
      top={{ xs: 0, md: 'auto' }}
      w="100%"
      zIndex={zIndex}
      {...props}
    >
      <x.h3>
        {children}
      </x.h3>
    </S.Title>
  )
}