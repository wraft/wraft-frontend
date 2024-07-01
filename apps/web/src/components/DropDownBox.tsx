import React from 'react';
import styled from '@emotion/styled';
import { Box, Flex, Text, Image } from 'theme-ui';

const DropDownBoxBlock = styled(Box)`
  border-radius: 3px;
  position: relative;
  display: flex;
  align-items: center;
  height: 48px;
  padding: 18px;
  text-transform: capitalize;
  flex: 1;
  .dropdown-text {
    align-items: baseline;
    width: 100%;
    justify-content: space-between;
    img {
      width: 18px;
      transform: rotate(90deg);
    }
  }
`;

const DropDownList = styled.ul`
  position: absolute;
  background-color: #fff;
  width: 120%;
  left: 0;
  top: 34px;
  z-index: 1;
  border-radius: 3px;
  padding: 0px;
`;

const DropDownItem = styled.li`
  list-style: none;
  padding: 0px;
  border-bottom: 1px solid #ccc;
`;

class DropDownBox extends React.Component<any, any> {
  private wrapperRef: any;
  constructor(props: any) {
    super(props);

    this.state = {
      open: false,
      selected: this.props?.initial || -1,
    };
    this.wrapperRef = React.createRef();
  }

  toggleDropdown() {
    this.setState({
      active: !this.state?.active,
    });
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
    // document.addEventListener('mousedown', this.toggleDropdown(), false);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside = (_e: any) => {
    if (this.wrapperRef && !this.wrapperRef.current.contains(_e.target)) {
      this.setState({
        active: false,
      });
    }
  };

  handleClick(i: any) {
    this.setState({
      selected: i,
    });
  }

  renderOptions() {
    if (!this.props.options) {
      return;
    }

    return this.props.options.map((option: any, i: number) => {
      return (
        <DropDownItem
          onClick={() => this.props.onChangeDate(option.date)}
          key={i}>
          <Text px={3} py={3}>
            {option.date}
          </Text>
        </DropDownItem>
      );
    });
  }

  render() {
    return (
      <DropDownBoxBlock
        ref={this.wrapperRef}
        onClick={() => this.toggleDropdown()}>
        <Flex className="dropdown-text">
          <Text>{this.props.title}</Text>
          <Image alt="" src="../static/images/next.svg" />
        </Flex>
        {this.state.active && (
          <DropDownList>{this.renderOptions()}</DropDownList>
        )}
      </DropDownBoxBlock>
    );
  }
}

export default DropDownBox;
