import React from "react";

import { CreateWuiProps, forwardRef } from "@/system";

import * as S from "./styles";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "xxl" | number;

export interface AvatarOptions {
  /**
   * The alt text for the avatar image
   */
  alt?: string;
  /**
   * The source URL of the avatar image
   */
  src?: string;
  /**
   * The size of the avatar
   */
  size?: AvatarSize;
  /**
   * The shape of the avatar (circle or square)
   */
  shape?: "circle" | "square";
  /**
   * The text to display when no image is available (usually initials)
   */
  name?: string;
  /**
   * Background color for the avatar when displaying initials
   */
  backgroundColor?: string;
  /**
   * Text color for the avatar when displaying initials
   */
  color?: string;
  /**
   * Callback when the image fails to load
   */
  onError?: React.EventHandler<React.SyntheticEvent<HTMLImageElement>>;
}

export type AvatarProps = CreateWuiProps<"div", AvatarOptions>;

/**
 * Gets initials from a name string
 */
const getInitials = (name: string): string => {
  if (!name) return "";

  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

export const Avatar = forwardRef<"div", AvatarProps>(
  (
    {
      alt = "Avatar",
      src,
      name,
      size = "md",
      shape = "circle",
      backgroundColor,
      color,
      onError,
      dataTestId,
      ...rest
    },
    ref,
  ) => {
    const [imgError, setImgError] = React.useState(!src);

    const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
      setImgError(true);
      if (onError) onError(e);
    };

    const initials = name ? getInitials(name) : null;
    const showInitials = imgError && initials;

    return (
      <S.Avatar
        ref={ref}
        size={size}
        shape={shape}
        data-testid={dataTestId}
        backgroundColor={backgroundColor}
        color={color}
        {...rest}
      >
        {!imgError && src && (
          <S.AvatarImage
            alt={alt}
            src={src}
            onError={handleError}
            data-testid={dataTestId && `${dataTestId}-image`}
          />
        )}
        {showInitials && (
          <S.AvatarInitials
            size={size}
            data-testid={dataTestId && `${dataTestId}-initials`}
          >
            {initials}
          </S.AvatarInitials>
        )}
      </S.Avatar>
    );
  },
);

Avatar.displayName = "Avatar";
