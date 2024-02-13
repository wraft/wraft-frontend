import { forwardRef } from 'react';
import * as Ariakit from '@ariakit/react'
import * as S from './styles'


export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'auto'


export interface ModalOptions extends Omit<Ariakit.DialogOptions<'div'>, 'as'> {
  ariaLabel: string
  children: React.ReactElement
  size?: Size
}


type BackdropProps = Pick<ModalOptions, 'hideOnInteractOutside' | 'backdrop'>

const Backdrop = forwardRef<HTMLDivElement, BackdropProps>(
  ({ backdrop, hideOnInteractOutside, ...rest }, ref) => {
    if (backdrop === true) {
      return <S.Backdrop hideOnInteractOutside={hideOnInteractOutside} ref={ref} {...rest} />
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return cloneElement(backdrop, { hideOnInteractOutside, ref, ...rest })
  }
)

const ModalComponent = forwardRef<HTMLDivElement, ModalOptions>(
  (
    {
      ariaLabel,
      /** for render property */
      // as = S.Dialog,
      backdrop = true,
      children,
      hideOnInteractOutside = true,
      size = 'lg',
      store,
      ...rest
    },
    ref
  ) => {
    return (
      <Ariakit.Dialog
        aria-label={ariaLabel}
        backdrop={
          backdrop && <Backdrop backdrop={backdrop} hideOnInteractOutside={hideOnInteractOutside} />
        }
        hideOnInteractOutside={hideOnInteractOutside}
        ref={ref}
        // as=
        // render={<As size={size} />}
        store={store}
        {...(rest as Ariakit.DialogProps<'div'>)}
      >
        {children}
      </Ariakit.Dialog>
    )
  }
)


// Nested exports
export const Modal = Object.assign(ModalComponent, {})