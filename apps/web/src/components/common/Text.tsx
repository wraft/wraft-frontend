import React, { forwardRef, Ref } from 'react';
import { SystemProps, x } from '@xstyled/emotion';

interface IProps {
  className?: string;
}
export interface TextProps
  extends SystemProps,
    IProps,
    Omit<React.HTMLProps<HTMLParagraphElement>, 'color' | 'as'> {}

export const Text = forwardRef(
  ({ className, ...rest }: TextProps, ref: Ref<HTMLParagraphElement>) => {
    const Element = x.p;

    return <Element className={className} ref={ref} {...rest} />;
  },
);
Text.displayName = '@wraft/Text';
