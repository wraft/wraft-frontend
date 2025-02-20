import styled from "@xstyled/emotion";

export interface SpinnerOptions {
  size?: number;
  color?: string;
}

export const Spinner = ({ size = 12, color = "#fff" }: SpinnerOptions) => {
  return <StyledSpinner size={size} color={color} />;
};

const StyledSpinner = styled.div<{ size: number; color?: string }>`
  height: ${(props) => `${props.size + 2}px`};
  width: ${(props) => `${props.size + 2}px`};
  position: relative;

  &::after {
    content: "";
    position: absolute;
    width: ${(props) => `${props.size}px`};
    height: ${(props) => `${props.size}px`};
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    border: 3px solid #bdb8b87d;
    border-top-color: primary;
    border-radius: 50%;
    animation: load3 1s infinite linear;
  }

  @-webkit-keyframes load3 {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  @keyframes load3 {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
`;
