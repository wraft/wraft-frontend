import styled, { th, x, css, right, useUp, up } from '@xstyled/emotion';
import * as Ariakit from '@ariakit/react'

import { Size } from './index'

export type BackdropProps = Pick<Ariakit.DialogOptions, 'hideOnInteractOutside'>

export const Backdrop: any = styled.divBox<Pick<BackdropProps, 'hideOnInteractOutside'>>(
  ({ hideOnInteractOutside }) => css`
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    opacity: 0;
    transition: opacity 150ms ease-in-out;
    

    ${hideOnInteractOutside &&`
      cursor: pointer;
    `}

    &[data-enter] {
      opacity: 1;
    }
  `
)



export const Dialog: any = styled.div`
  position: fixed;
  inset: 0;
  margin: auto;
  margin-top: xl;
  top: 50%;
  transform: translate3d(0, -50%, 0);
  display: flex;
  flex-direction: column;
  align-self: center;
  height: 100%;
  max-height: 100%;
  max-width: 100%;
  overflow: auto;
  opacity: 0;
  transition: opacity 250ms ease-in-out, margin-top 250ms ease-in-out;

  &[data-enter] {
    opacity: 1;
    margin-top: 0;
  }

  ${up(
    'md',
    css`
      height: fit-content;
    `,
  )}
`