import styled from "@xstyled/emotion";

export const Inner: any = styled.div`
  background-color: white;
  box-shadow: 2px 3px 14px 0px var(--theme-ui-colors-border);
  border: solid 1px var(--theme-ui-colors-border);
  border-radius: md2;
  z-index: 20;
`;
export const Item: any = styled.div`
  cursor: pointer;
  padding: sm sm;
  display: flex;
  align-items: center;
  color: text-primary;
  min-width: 120px;
  border-bottom: solid 1px var(--theme-ui-colors-gray-a300);
  font-size: sm2;
  &[data-active-item] {
    background-color: green.a200;
    color: green.900;
  }
`;
export const Trigger: any = styled.divBox`
  cursor: pointer;
  &[data-active-item] {
    background: #f0f2f5;
  }
`;
export const Separator: any = styled.hr`
  border: 0;
  height: 1px;
  margin: 0;
  background-color: border;
`;
