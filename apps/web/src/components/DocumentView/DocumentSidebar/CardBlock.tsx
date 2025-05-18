import styled from '@emotion/styled';
import { Box } from '@wraft/ui';

export const CardBlockWrapper = styled(Box)<{ isHighlighted?: boolean }>`
  display: flex;
  cursor: pointer;
  background-color: green.600;
  &:last-child {
    border-bottom: solid 1px;
    border-color: green.600;
  }

  &:hover {
    background: ${({ theme }: any) => theme.colors.green['200']};
  }
`;

export const CardBlock = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return <CardBlockWrapper>{children}</CardBlockWrapper>;
};
