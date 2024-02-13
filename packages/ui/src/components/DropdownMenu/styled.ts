import styled, { th, x } from '@xstyled/emotion';


export const Inner: any = styled('div')`
  background-color: white;
  box-shadow: 2px 3px 14px 0px #00000029;  
`
export const Item: any = styled.div`
  cursor: pointer;
  padding: 6px 12px;
  &[data-active-item] {
    background: #F0F2F5;
  }
`
export const Trigger: any = styled.div`
  cursor: pointer;
  padding: 6px 12px;
  &[data-active-item] {
    background: #F0F2F5;
  }
`
export const Separator: any = styled.hr`
  border: 0;
  height: 1px;
  margin: 0;
  background: #E4E9EF;
`