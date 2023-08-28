import React, { useContext } from "react";
import TableDataContext from "../context";
const Pagination = () => {
  const context = useContext(TableDataContext);
  const {
    handlePageChange,
    currentPage,
    totalPages,
    resultsPerPage,
    setResultsPerPage,
    handleResultsPerPage,
  } = context;
  return (
    <div className="paginationStyling">
      {" "}
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &lt;
        </button>
        <span className="current-page">{currentPage}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>
      </div>
      <div className="results-per-page">
        Results per page:
        <input
          type="number"
          value={resultsPerPage}
          onChange={(e) => {
            setResultsPerPage(e.target.value);
          }}
          onKeyDown={(e) => handleResultsPerPage(e)}
        />
      </div>
    </div>
  );
};
export default Pagination;
