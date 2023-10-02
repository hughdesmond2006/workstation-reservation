import styled from "styled-components";
import { PropTypes } from "prop-types";

/*
    Simple scrollable flex grid that accepts an array of arrays for data.
    First array is header data, the rest are rows. First item in each row 
    array is the side heading.

    Example data:
    [["", "mon", "tue", "wed", "thu", "fri"],
    ["9:00am", "111", "222", "333", "444", "555"],
    ["9:30am", "111", "222", "333", "444", "555"],
    ["10:00am", "111", "222", "333", "444", "555"],
    ["10:30am", "111", "222", "333", "444", "555"]]
*/
function Grid({ data, onCellClick }) {
  if (!data) return <></>;

  const headerData = data[0];
  const bodyData = data.slice(1);

  return (
    <s.wrapper>
      <s.header $numCols={headerData.length}>
        {headerData.map((header, i) => (
          <div key={`header${i}`}>{header}</div>
        ))}
      </s.header>
      <s.body $numCols={bodyData[0].length}>
        {bodyData.map((row, i) =>
          row.map((cell, j) => (
            // onCellClick is called with the event (e), row index (i) and column index (j)
            <s.cell
              key={`cell${i + j}`}
              onClick={(e) => onCellClick(e, i, j)}
              $booked={cell === "Booked"}
            >
              {cell}
            </s.cell>
          ))
        )}
      </s.body>
    </s.wrapper>
  );
}

// using parameterised styled components to control hover/click/highlighting behaviors based on
// data within the grid
const s = {
  wrapper: styled.div`
    -ms-overflow-style: none; /* Internet Explorer 10+ */
    scrollbar-width: none; /* Firefox */
    position: fixed;
    bottom: 0;
    width: 100%;
    min-width: 400px;

    ::-webkit-scrollbar { 
      display: none; /* Safari and Chrome */   
    }
  `,
  cell: styled.div`
    background-color: ${(props) => (props.$booked ? "#f0f0f0" : "white")};
    pointer-events: ${(props) => (props.$booked ? "none" : "all")} ;
  `,
  header: styled.div`
    margin: 0px;
    width: 100%;
    background-color: #f0f0f0;
    border-top: 1px solid lightgray;
    border-left: 1px solid lightgray;
    display: grid;
    grid-gap: 0px;
    grid-template-rows: 1fr;
    grid-template-columns: 5rem ${(props) =>
        Array.from(Array(props.$numCols - 1))
          .map(() => "1fr ")
          .join("")};

    div {
      border: 1px solid lightgray;
      border-top: none;
      border-left: none;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0.5rem;
    }
  `,
  body: styled.div`
    margin: 0px;
    width: 100%;
    display: grid;
    background-color: white;
    border-bottom: 1px solid lightgray;
    border-left: 1px solid lightgray;
    grid-gap: 0px;
    height: 40vh;
    overflow: auto;
    grid-template-columns: 5rem ${(props) =>
        Array.from(Array(props.$numCols - 1))
          .map(() => "1fr ")
          .join("")};

    div {
      border: 1px solid lightgray;
      border-top: none;
      border-left: none;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0.5rem;
      position: relative;
    }

    // enable hover and pointer for data cells
    div:not(:nth-child(${(props) => props.$numCols}n + 1)):hover {
      background-color: #f0f0f0;
      cursor: pointer;
    }

    div:not(:nth-child(${(props) => props.$numCols}n + 1)):hover:before {
      background-color: #b7ffb7;
      content: "Book Now!";
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    div:nth-last-child(-n + ${(props) => props.$numCols}) {
      border-bottom: none;
    }
  `,
};

Grid.propTypes = {
  data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
  onCellClick: PropTypes.func.isRequired,
};

export default Grid;
