import React, {useState, useContext} from 'react';
import {HarnessContext, ROWS, COLUMNS} from './Harness.js';

const TableHighlightContext = React.createContext();

function Table() {
  const [highlightedCell, setHighlightedCell] = useState({
    row: -1,
    column: -1,
  });
  return (
    <TableHighlightContext.Provider value={highlightedCell}>
      <table>
        <tbody>
          {Array(ROWS)
            .fill()
            .map((_, i) => (
              <TableRow
                key={i}
                row={i}
                setHighlightedCell={setHighlightedCell}
              />
            ))}
        </tbody>
      </table>
    </TableHighlightContext.Provider>
  );
}

const TableRow = React.memo(({row, setHighlightedCell}) => {
  return (
    <tr>
      {Array(COLUMNS)
        .fill()
        .map((_, i) => (
          <TableCell
            key={i}
            row={row}
            column={i}
            setHighlightedCell={setHighlightedCell}
          />
        ))}
    </tr>
  );
});

function TableCell({row, column, setHighlightedCell}) {
  const ctx = React.useContext(TableHighlightContext);
  const {row: hRow, column: hCol} = ctx;
  const isHighlighted = hRow === row || hCol === column;
  const wrapSetter = useContext(HarnessContext);
  return (
    <td
      onMouseEnter={wrapSetter(() =>
        setHighlightedCell({row, column}),
      )}
      style={isHighlighted ? highlightedStyle : null}>
      {row}x{column}
    </td>
  );
}

const highlightedStyle = {
  background: 'var(--text-color)',
  color: 'var(--background-color)',
};

export default Table;
