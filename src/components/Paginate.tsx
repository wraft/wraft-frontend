import React from 'react';
import ReactPaginate from 'react-paginate';
import styled from '@emotion/styled';
import { Box, Flex, Text } from 'theme-ui';

export interface IPageMeta {
  page_number?: number;
  total_entries?: number;
  total_pages?: number;
  contents?: any;
  changePage?: any;
  info?: any;
}

// background-color: ${(p:any) => `${p.theme.colors.primary}`};

const StyledPaginateContainer = styled(Flex)`
  .pagination {
    display: flex;
    list-style: none;
    padding: 0;
  }
  a {
    padding: 4px;
    padding-left: 8px;
    padding-right: 8px;
    border-radius: 4px;
    cursor: pointer;
  }
  .break-me {
    cursor: default;
  }
  .active {
    border-color: transparent;
    color: white;
    color: #355175;
    background: #ddd;
    padding-top: 2px;
    border-radius: 12px;
  }
`;

const Paginate = ({ total_pages, changePage, info }: IPageMeta) => {
  return (
    <StyledPaginateContainer sx={{ fontSize: 2 }}>
      <ReactPaginate
        pageCount={total_pages || 0}
        pageRangeDisplayed={5}
        marginPagesDisplayed={5}
        onPageChange={(e) => changePage(e)}
        containerClassName="pagination"
        activeClassName="active"
        previousLabel="Prev"
        nextLabel="Next"
        breakLabel="..."
        breakClassName="break-me"
      />
      <Box sx={{ ml: 'auto', mr: 3, fontSize: 2, color: 'gray.2' }}>{info}</Box>
    </StyledPaginateContainer>
  );
};

export default Paginate;
