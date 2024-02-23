import { ReactElement } from 'react'
import styled, { th, x } from '@xstyled/emotion';
import * as Ariakit from '@ariakit/react'

import * as S from './styles'
// CloseIcon

export interface HeaderProps {
  title?: string | JSX.Element
  subtitle?: string | JSX.Element
  icon?: ReactElement
  children: React.ReactNode
}


/**
 * @name Modal.Header
 */
export const Header = ({ icon, subtitle, title, children }: HeaderProps) => {
  return (
    <Ariakit.DialogHeading className="heading">
      {children}
    </Ariakit.DialogHeading>
    // <S.Header ref={ref} textAlign={icon ? 'center' : null} w="100%" {...rest}>
    //   <Close isOnHeader />
    //   {icon}
    //   <Text mb={subtitle ? 'lg' : 0} mt={icon ? 'xl' : 0} variant="h4">
    //     {title}
    //   </Text>
    //   {subtitle && <S.HeaderSubtitle>{subtitle}</S.HeaderSubtitle>}
    // </S.Header>
  )
}

Header.displayName = 'Header'