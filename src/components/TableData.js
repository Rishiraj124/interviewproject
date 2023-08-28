import React, { useEffect, useRef, useState } from "react";
import "./tabledata.css"; // Import your CSS file with styles
import axios from "axios";
import "./searchbox.css";
import TableDataContext from "../context";
import Pagination from "./Pagination";
function TableData() {
  const [searchText, setSearchText] = useState("");
  const [countryList, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSearchCountryisDisabled, setisSearchCountryisDisabled] =
    useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(5);
  const handleFocus = () => {
    setIsFocused(true);
  };
  const handleBlur = () => {
    setIsFocused(false);
  };
  //Not specified when to use the disabled handler hence the below code is unused
  const handleToggleDisabled = () => {
    setisSearchCountryisDisabled(!isSearchCountryisDisabled);
  };
  const inputRef = useRef(null);

  const handleShortcut = (event) => {
    //to handle focus event on shortcut key press
    if (event.ctrlKey && event.key === "/") {
      event.preventDefault();
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    //Adding event handler for shortcut keypress on initial render
    window.addEventListener("keydown", handleShortcut);

    return () => {
      window.removeEventListener("keydown", handleShortcut);
    };
  }, []);

  const renderCountryFlag = (countryId) => {
    //Displaying country flag based on id
    if (!countryId) {
      return "No result found";
    }

    const flagUrl = `https://www.countryflagsapi.com/png/${countryId}`;

    return <img src={flagUrl} alt={`Flag of ${countryId}`} />;
  };
  const fetchDataHandler = (updatedPage) => {
    //fetching data based on search query entered
    if (!searchText) {
      setCountries([]);
      return;
    }

    setLoading(true);

    const options = {
      method: "GET",
      url: "https://wft-geo-db.p.rapidapi.com/v1/geo/adminDivisions",
      params: {
        countryIds: "IN",
        namePrefix: searchText,
        limit: resultsPerPage,
        offset:
          (updatedPage ? updatedPage - 1 : currentPage - 1) * resultsPerPage,
      },
      headers: {
        "X-RapidAPI-Key": "e1e0d823f8msha7760efa9ee0c34p1b8c0djsn487831c3513c",
        "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
      },
    };

    axios
      .request(options)
      .then(function (response) {
        setCountries(response?.data?.data);
        setTotalCount(response?.data?.metadata?.totalCount);
        setLoading(false);
      })
      .catch(function (error) {
        console.error(error);
        setLoading(false);
      });
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      fetchDataHandler();
    }
  };
  //handling data based on pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= Math.ceil(totalCount / resultsPerPage)) {
      setCurrentPage(newPage);
      fetchDataHandler(newPage);
    }
  };

  const totalPages = Math.ceil(totalCount / resultsPerPage);
  const handleResultsPerPage = (event) => {
    if (event.key === "Enter") {
      if (resultsPerPage < 5 || resultsPerPage > 10) {
        alert("entered value should be between 5 and 10");
      } else {
        fetchDataHandler();
      }
    }
  };
  return (
    <div>
      <div
        className={`search-country-container } ${
          isSearchCountryisDisabled ? "disabled" : ""
        }`}
      >
        <input
          type="text"
          ref={inputRef}
          className={`search-input ${isFocused ? "focused" : ""}`}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search places..."
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={isSearchCountryisDisabled}
        />
        <div className="shortcut">Ctrl + /</div>
      </div>

      {loading && <div className="spinner"></div>}

      <table className="country-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Place Name</th>
            <th>Country</th>
          </tr>
        </thead>
        <tbody>
          {countryList.length === 0 && !loading && (
            <tr>
              <td colSpan="3">Start searching</td>
            </tr>
          )}
          {countryList.length === 0 && searchText && (
            <tr>
              <td colSpan="3">No Results Found</td>
            </tr>
          )}
          {countryList.map((country, index) => (
            <tr key={country?.id}>
              <td>{index + 1}</td>
              <td>{country?.name}</td>
              <td>{renderCountryFlag(country?.countryCode)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <TableDataContext.Provider
        value={{
          handlePageChange,
          currentPage,
          totalPages,
          resultsPerPage,
          setResultsPerPage,
          handleResultsPerPage,
        }}
      >
        {" "}
        <Pagination />
      </TableDataContext.Provider>
    </div>
  );
}

export default TableData;
