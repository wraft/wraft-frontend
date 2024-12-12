import React from 'react';
import { Text } from 'theme-ui';
import { Label } from 'theme-ui';
import Mentions from 'rc-mentions';
import styled from '@emotion/styled';

import { GlobalStyle } from './style';

const MentionsWrapper = styled.div`
  .rc-mentions {
    font-size: 20px;
    border: 1px solid #999;
    border-radius: 3px;
    overflow: hidden;
    font-size: ${({ theme }: any) => theme.fontSizes.sm} !important;
    border-radius: 4px;
    fontweight: fontWeight;
    padding: 6px 16px;
    color: ${({ theme }: any) => theme.rawColors.gray[1200]};
    background-color: ${({ theme }: any) => theme.rawColors.white} !important;
    border-color: var(--theme-ui-colors-border);
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
        <Text sx={{ position: 'absolute', right: 16, top: 32 }}>{sub}</Text>
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
