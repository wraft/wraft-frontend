import * as Ariakit from "@ariakit/react";
import styled from "@xstyled/emotion";
import { th } from "@xstyled/system";

export const DisclosureTrigger = styled(Ariakit.Disclosure)`
  ${th("buttons.ghost")};
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: ${th("space.sm")} ${th("space.md")};
  margin: ${th("space.sm")} 0;
  border: 1px solid;
  border-color: ${th("colors.border")};
  border-radius: ${th("radii.md")};
  background-color: ${th("colors.background-primary")};
  color: ${th("colors.text-secondary")};
  font-size: ${th("fontSizes.sm")};
  font-weight: ${th("fontWeights.medium")};
  cursor: pointer;
  transition: ${th("transitions.medium")};
  outline: none;

  &:hover {
    background-color: ${th("colors.gray.100")};
    border-color: ${th("colors.gray.300")};
    color: ${th("colors.text-primary")};
  }

  &:focus {
    ${th("buttons.focus.ghost")};
  }

  &:active {
    background-color: ${th("colors.gray.200")};
  }

  &[aria-expanded="true"] {
    background-color: ${th("colors.gray.50")};
    border-color: ${th("colors.primary")};
    color: ${th("colors.text-primary")};
  }

  &[aria-expanded="true"]:hover {
    background-color: ${th("colors.gray.100")};
  }

  svg {
    transition: transform ${th("transitions.medium")};
    color: ${th("colors.text-secondary")};
  }

  &[aria-expanded="true"] svg {
    transform: rotate(180deg);
    color: ${th("colors.primary")};
  }
`;

export const DisclosureContent = styled(Ariakit.DisclosureContent)`
  padding: ${th("space.md")};
  margin: 0 0 ${th("space.sm")} 0;
  border: 1px solid;
  border-color: ${th("colors.border")};
  border-top: none;
  border-radius: 0 0 ${th("radii.md")} ${th("radii.md")};
  background-color: ${th("colors.background-primary")};
  overflow: hidden;
  transition: all ${th("transitions.medium")};

  &[data-enter] {
    animation: slideDown 200ms ease-out;
  }

  &[data-leave] {
    animation: slideUp 200ms ease-in;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      max-height: 0;
      padding-top: 0;
      padding-bottom: 0;
    }
    to {
      opacity: 1;
      max-height: 200px;
      padding-top: ${th("space.md")};
      padding-bottom: ${th("space.md")};
    }
  }

  @keyframes slideUp {
    from {
      opacity: 1;
      max-height: 200px;
      padding-top: ${th("space.md")};
      padding-bottom: ${th("space.md")};
    }
    to {
      opacity: 0;
      max-height: 0;
      padding-top: 0;
      padding-bottom: 0;
    }
  }
`;

export const DisclosureProvider = styled(Ariakit.DisclosureProvider)`
  width: 100%;
`;
