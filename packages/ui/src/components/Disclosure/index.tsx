import * as Ariakit from "@ariakit/react";
import { forwardRef } from "react";

import { CreateWuiProps } from "@/system";

import {
  DisclosureProvider,
  DisclosureTrigger,
  DisclosureContent,
} from "./styles";

export interface DisclosureOptions extends Ariakit.DisclosureStoreProps {
  children: React.ReactNode;
}

export type DisclosureProps = CreateWuiProps<
  typeof DisclosureProvider,
  DisclosureOptions
>;

export interface DisclosureTriggerOptions extends Ariakit.DisclosureProps {
  children: React.ReactNode;
  className?: string;
}

export type DisclosureTriggerProps = CreateWuiProps<
  typeof DisclosureTrigger,
  DisclosureTriggerOptions
>;

export interface DisclosureContentOptions
  extends Ariakit.DisclosureContentProps {
  children: React.ReactNode;
  className?: string;
}

export type DisclosureContentProps = CreateWuiProps<
  typeof DisclosureContent,
  DisclosureContentOptions
>;

const DisclosureComponent = forwardRef<HTMLDivElement, DisclosureProps>(
  ({ children, ...props }, ref) => {
    return (
      <DisclosureProvider {...props}>
        <div ref={ref}>{children}</div>
      </DisclosureProvider>
    );
  },
);

DisclosureComponent.displayName = "Disclosure";

const DisclosureTriggerComponent = forwardRef<
  HTMLButtonElement,
  DisclosureTriggerProps
>(({ children, ...props }, ref) => {
  return (
    <DisclosureTrigger ref={ref} {...props}>
      {children}
    </DisclosureTrigger>
  );
});

DisclosureTriggerComponent.displayName = "Disclosure.Trigger";

const DisclosureContentComponent = forwardRef<
  HTMLDivElement,
  DisclosureContentProps
>(({ children, ...props }, ref) => {
  return (
    <DisclosureContent ref={ref} {...props}>
      {children}
    </DisclosureContent>
  );
});

DisclosureContentComponent.displayName = "Disclosure.Content";

export const Disclosure = Object.assign(DisclosureComponent, {
  Trigger: DisclosureTriggerComponent,
  Content: DisclosureContentComponent,
});

export type UseDisclosure = Ariakit.DisclosureStore;
export type UseDisclosureProps = Ariakit.DisclosureStoreProps;
export type UseDisclosureState = Ariakit.DisclosureStoreState;

export function useDisclosure(options: UseDisclosureProps = {}): UseDisclosure {
  return Ariakit.useDisclosureStore(options);
}
