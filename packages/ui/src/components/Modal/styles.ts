import styled, { css, up } from "@xstyled/emotion";

export type BackdropProps = {
  $hideOnInteractOutside?: boolean;
  backdrop?: boolean | React.ReactElement;
};

export const Backdrop: any = styled.divBox<BackdropProps>`
  ${({ $hideOnInteractOutside }) =>
    $hideOnInteractOutside &&
    `
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    opacity: 0;
    background-color: rgba(0, 0, 0, 0.5);
    cursor: pointer;
    transition: opacity 250ms cubic-bezier(0.16, 1, 0.3, 1);

    &[data-enter] {
      opacity: 1;
    }
  `};
`;

export const Dialog: any = styled.div`
  position: fixed;
  inset: 0.75rem;
  z-index: 1000;
  margin: auto;
  display: flex;
  height: fit-content;
  max-height: calc(100dvh - 2 * 0.75rem);
  flex-direction: column;
  gap: 1rem;
  // overflow: auto;
  border-radius: sm;
  background-color: modal-background;
  border: 1px solid;
  border-color: border;
  padding: 1rem;
  color: hsl(204 10% 10%);
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  opacity: 0;
  transform: scale(0.95);
  transition:
    opacity 250ms cubic-bezier(0.16, 1, 0.3, 1),
    transform 250ms cubic-bezier(0.16, 1, 0.3, 1);

  @media (min-width: 640px) {
    .button {
      gap: 0.5rem;
    }
  }

  :is(.dark .dialog) {
    border-width: 1px;
    border-style: solid;
    border-color: hsl(204 3% 26%);
    background-color: hsl(204 3% 18%);
    color: hsl(204 20% 100%);
  }

  @media (min-width: 640px) {
    top: 10vh;
    bottom: 10vh;
    margin-top: 0px;
    max-height: 80vh;
    width: fit-content;
    max-width: 80%;
    border-radius: md;
    padding: 1.5rem;
  }

  .heading {
    margin: 0px;
    font-size: 1.25rem;
    line-height: 1.75rem;
    font-weight: 600;
    color: text-primary;
  }

  // position: fixed;
  // inset: 0;
  // margin: auto;
  // margin-top: xl;
  // top: 50%;
  // transform: translate3d(0, -50%, 0);
  // display: flex;
  // flex-direction: column;
  // align-self: center;
  // height: 100%;
  // max-height: 100%;
  // max-width: 100%;
  // overflow: auto;
  // opacity: 0;
  // transition: opacity 250ms ease-in-out, margin-top 250ms ease-in-out;

  &[data-enter] {
    opacity: 1;
    transform: scale(1);
  }

  ${up(
    "md",
    css`
      height: fit-content;
    `,
  )}
`;
