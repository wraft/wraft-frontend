import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

export const Container = styled.div`
  width: 24rem;
  margin: 0 auto;
  padding: 1rem;
`;

export const Header = styled.div`
  margin-bottom: 2rem;
`;

export const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

export const Subtitle = styled.p`
  color: #6b7280;
  margin: 0rem;
`;

export const InputContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 2rem;
`;

export const Input = styled.input`
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 1px #4f46e5;
  }
`;

export const Button = styled.button`
  background-color: #4f46e5;
  color: white;
  padding: 0.5rem 2rem;
  border: none;
  border-radius: 0.25rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #4338ca;
  }
`;

export const MemberList = styled.div`
  display: flex;
  flex-direction: column;
`;

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

export const MemberInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const Avatar = styled.img`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  object-fit: cover;
`;

export const MemberName = styled.div`
  font-weight: 500;
  text-decoration: none;
  padding-right: 8px;

  &:hover {
    text-decoration: underline;
  }
`;

export const MemberEmail = styled.span`
  color: #6b7280;
  padding-right: 8px;
`;

export const MoreButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  color: #6b7280;

  &:hover {
    color: #4f46e5;
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const Dropdown = styled.div`
  position: absolute;
  right: 0;
  margin-top: 0.5rem;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.25rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 0.2s ease-out;
`;

export const DropdownItem = styled.button`
  display: block;
  width: 100%;
  padding: 0.5rem 1rem;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #f3f4f6;
  }
`;
