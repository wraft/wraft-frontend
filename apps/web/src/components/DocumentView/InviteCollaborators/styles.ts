import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

export const MemberItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0.25rem;
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
  }
`;
