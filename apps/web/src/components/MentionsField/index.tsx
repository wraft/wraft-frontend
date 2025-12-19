import React from 'react';
import { Text, Label } from '@wraft/ui';
import Mentions from 'rc-mentions';
import styled from '@emotion/styled';

import { GlobalStyle } from './style';

const MentionsWrapper = styled.div`
  .rc-mentions {
    border: 1px solid #999;
    border-radius: 3px;
    overflow: hidden;
    font-size: ${({ theme }: any) => theme.fontSizes.sm} !important;
    border-radius: 4px;
    fontweight: fontWeight;
    padding: 6px 16px;
    background-color: var(--theme-ui-colors-background-primary);
    border-color: var(--theme-ui-colors-border);
  }
  .rc-textarea {
    font-size: 1rem;
    color: var(--theme-ui-colors-text-primary);
  }
  textarea {
    color: ${({ theme }: any) => theme.colors.text};
  }
`;

const MentionField: React.FC<any> = ({
  error,
  sub,
  label = '',
  placeholder,
  options,
  name = '',
  onChange,
  defaultValue,
}) => {
  const handleChange = (newValue: any) => {
    const formattedText = newValue.replace(/@(?=\[)/g, '');
    onChange(formattedText);
  };
  return (
    <>
      <GlobalStyle />
      {sub && (
        <Text as="span" position="absolute" right="16px" top="32px">
          {sub}
        </Text>
      )}
      {label && (
        <Label htmlFor="description" color="text-secondary">
          {label}
        </Label>
      )}

      <MentionsWrapper>
        <Mentions
          onChange={handleChange}
          prefix={['@']}
          split=""
          placeholder={placeholder}
          options={options}
          value={defaultValue || ''}
          id={name}
        />
        {error && (
          <Text as="span" position="absolute" bottom="-22px" left="4px">
            {error.message}
          </Text>
        )}
      </MentionsWrapper>
    </>
  );
};

export default MentionField;
