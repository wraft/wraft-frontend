import React from 'react';
import ReactPaginate from 'react-paginate';
import styled from '@emotion/styled';

export interface IPageMeta {
  page_number?: number;
  total_entries?: number;
  total_pages?: number;
  contents?: any;
  changePage?: any;
}

// background-color: ${(p:any) => `${p.theme.colors.primary}`};

const StyledPaginateContainer = styled.div`
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
  }
  .break-me {
    cursor: default;
  }
  .active {
    border-color: transparent;
    
    color: white;
    font-size: 14px;
    padding-top: 2px;
    border-radius: 4px;
  }
`;

const Paginate = ({ total_pages, changePage }: IPageMeta ) => {
  return (
      <StyledPaginateContainer>
        <ReactPaginate
          pageCount={total_pages || 0}
          pageRangeDisplayed={5}
          marginPagesDisplayed={5}
          onPageChange={(e) => changePage(e)}
          containerClassName="pagination"
          activeClassName="active"
          previousLabel="prev"
          nextLabel="next"
          breakLabel="..."
          breakClassName="break-me"
        />
      </StyledPaginateContainer>
    )
}

export default Paginate;
