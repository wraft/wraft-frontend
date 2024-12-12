import styled from '@xstyled/emotion';

const Container = styled.divBox`
  background: transparent;
  .rest-line {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .line {
    height: 1px;
    flex: 1;
    margin-left: 12px;
  }
`;

const Circle = styled.divBox`
  width: 24px;
  height: 24px;
  text-align: center;
  font-size: 12px;
  line-height: 1.5;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 1rem;
  font-weight: 500;
`;

export { Container, Circle };
