import { useEffect, useState } from "react";

import "../../styles/components/pagination/pagination.scss";
import Pagination from ".";

const DEFAULT_PAGE_SIZE = 10;

interface IProp {
  totalRecord: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;

  showPageSize?: boolean;
  showGoto?: boolean;
  initialPageSize?: number;
  pageSizeLabel?: string;
}
const PaginationInfo: React.FC<IProp> = ({
  totalRecord,
  initialPageSize = DEFAULT_PAGE_SIZE,
  onPageChange,
  onPageSizeChange,
  pageSizeLabel = "page Size",
  showGoto = true,
  showPageSize = false,
}) => {
  const [totalPage, setTotalPage] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const pageSizes = [10, 20, 50, 100];

  useEffect(() => {
    setPageSize(initialPageSize || DEFAULT_PAGE_SIZE);
  }, []);

  useEffect(() => {
    const pages = Math.ceil(totalRecord / pageSize);
    setTotalPage(pages);
  }, [pageSize, totalRecord]);

  return (
    <>
      <div className="pagination-info">
        <div className="pagination-info--summary">
          Page Selection: {totalRecord}
        </div>
        <div className="flex-spacer"></div>

        {showPageSize && (
          <select
            value={pageSize}
            onChange={(e) => {
              const cPageSize = Number(e.target.value);
              setPageSize(cPageSize);
              onPageSizeChange && onPageSizeChange(cPageSize);
            }}
          >
            {pageSizes.map((ps) => (
              <option key={ps} value={ps}>
                {pageSizeLabel} {ps}
              </option>
            ))}
          </select>
        )}

        <Pagination
          showGoto={showGoto}
          totalPage={totalPage}
          onPageChange={onPageChange}
        />
      </div>
    </>
  );
};

export default PaginationInfo;
