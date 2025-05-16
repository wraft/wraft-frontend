import React from 'react';
import { Text } from '@wraft/ui';
import { Label } from 'theme-ui';
import Mentions from 'rc-mentions';
import styled from '@emotion/styled';

import { GlobalStyle } from './style';

const MentionsWrapper = styled.div`
  .rc-mentions {
    border: 1px solid #999;
    border-radius: 3px;
    overflow: hidden;
    font-size: ${({ theme }: any) => theme.fontSizes.sm2} !important;
    border-radius: 6px;
    font-weight: 600;
    padding: 8px 16px;
    background-color: ${({ theme }: any) => theme.rawColors.white} !important;
    border-color: var(--theme-ui-colors-border);
  }
  .rc-textarea {
    font-size: ${({ theme }: any) => theme.fontSizes.base} !important;
    font-weight: 600;
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
        <Text position="absolute" right="16px" top="32px">
          {sub}
        </Text>
      )}
      {label && (
        <Label htmlFor="description" sx={{ color: 'gray.a1100' }}>
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
          onSelect={(val) => console.log('onSelect', val)}
        />
        {error && (
          <Text
            sx={{ position: 'absolute', bottom: '-22px', left: '4px' }}
            variant="error">
            {error.message}
          </Text>
        )}
      </MentionsWrapper>
    </>
  );
};

export default MentionField;
