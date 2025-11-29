import styled, { th } from "@xstyled/emotion";

import type { Placement } from ".";

const getPlacementStyle = (placement: Placement) => {
  switch (placement) {
    case "top":
      return {
        top: "0 !important",
        right: 0,
        left: 0,
        transform: "translateY(-100%)",
      };
    case "right":
      return {
        top: "0 !important",
        right: 0,
        bottom: 0,
        transform: "translateX(100%)",
      };
    case "bottom":
      return {
        right: 0,
        bottom: 0,
        left: 0,
        transform: "translateY(100%)",
      };
    case "left":
      return {
        top: "0 !important",
        bottom: 0,
        left: 0,
        transform: "translateX(-100%)",
      };
  }
};

export const Drawer: any = styled.div`
  ${(props: any) => getPlacementStyle(props.placement)};
  position: fixed;
  display: flex;
  flex-direction: column;
  overflow: auto;
  opacity: 0;
  transition:
    transform 300ms ease-in-out,
    opacity 250ms ease;
  max-width: 100%;
  background-color: white;
  min-width: 500px;
  z-index: 999;

  &[data-enter] {
    opacity: 1;
    transform: translate(0, 0);
  }
`;

// export const Drawer: any = styled.divBox<Pick<DrawerOptions, 'placement' >>(
//   ({ placement}: any) => css`
//     ${getPlacementStyle(placement)}
//     position: fixed;
//     display: flex;
//     flex-direction: column;
//     overflow: auto;
//     opacity: 0;
//     transition: medium;
//     max-width: 100%;

//     &[data-enter] {
//       opacity: 1;
//       transform: translate(0, 0);
//     }
//   `
// )
// export const Drawer: any = styled.div`
// position: fixed;
//     top: 0;
//     right: 0;
//     left: 0;
//     bottom: 0;
//     opacity: 0;
//     // transition: opacity 150ms ease-in-out;

// `

export const Backdrop: any = styled.div<any>`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  opacity: 0;
  transition: opacity 300ms ease-in-out;
  background-color: rgba(0, 0, 0, 0.35);
  ${({ $hideOnInteractOutside }) =>
    $hideOnInteractOutside &&
    ` cursor: pointer;
      &[data-enter] {
        opacity: 1;
      }
    `};
`;

export const Title: any = styled.div`
  ${th("drawers.title")};
  font-size: base;
  color: gray.900;
  font-weight: bold;
`;

export const Header: any = styled.divBox`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
