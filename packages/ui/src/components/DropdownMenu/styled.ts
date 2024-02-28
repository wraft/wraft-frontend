import styled from '@xstyled/emotion';

export const Inner: any = styled('div')`
  background-color: white;
  box-shadow: 2px 3px 14px 0px #00000029;
  z-index: 1;
`;
export const Item: any = styled.div`
  cursor: pointer;
  padding: 6px 12px;
  display: flex;
  align-items: center;
  &[data-active-item] {
    background: #f0f2f5;
  }
`;
export const Trigger: any = styled.div`
  cursor: pointer;
  padding: 6px 12px;
  &[data-active-item] {
    background: #f0f2f5;
  }
`;
export const Separator: any = styled.hr`
  border: 0;
  height: 1px;
  margin: 0;
  background: #e4e9ef;
`;
