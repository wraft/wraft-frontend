import styled, { css, system, th } from "@xstyled/emotion";

import { WuiProps } from "@/system";

import { AvatarOptions } from ".";

type StyledAvatarProps = Pick<
  AvatarOptions,
  "size" | "shape" | "backgroundColor" | "color"
> &
  WuiProps;

export const Avatar = styled.div<StyledAvatarProps>`
  ${({ size = "md", shape = "circle", backgroundColor, color }) => css`
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: ${size && (th(`avatars.sizes.${size}.size`) as any)};
    height: ${size && (th(`avatars.sizes.${size}.size`) as any)};
    border-radius: ${shape === "circle" ? "50%" : (th.radius("sm") as any)};
    background-color: ${backgroundColor || (th.color("green.500") as any)};
    color: ${color || (th.color("light.900") as any)};
    overflow: hidden;
    flex-shrink: 0;
  `}
  ${system};
`;

export const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const AvatarInitials = styled.div<Pick<StyledAvatarProps, "size">>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-weight: 500;
  font-size: ${({ size = "md" }) =>
    size && (th(`avatars.sizes.${size}.fontSize`) as any)};
  text-transform: uppercase;
`;
