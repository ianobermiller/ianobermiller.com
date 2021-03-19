import React, {useState, useContext} from 'react';
import {HarnessContext, ROWS, COLUMNS} from './Harness.js';

function Table() {
  const [highlightedCell, setHighlightedCell] = useState({
    row: -1,
    column: -1,
  });
  return (
    <table>
      <tbody>
        {Array(ROWS)
          .fill()
          .map((_, i) => (
            <TableRow
              key={i}
              row={i}
              highlightedCell={highlightedCell}
              setHighlightedCell={setHighlightedCell}
            />
          ))}
      </tbody>
    </table>
  );
}

function TableRow({row, highlightedCell, setHighlightedCell}) {
  return (
    <tr>
      {Array(COLUMNS)
        .fill()
        .map((_, i) => (
          <TableCell
            key={i}
            row={row}
            column={i}
            highlightedCell={highlightedCell}
            setHighlightedCell={setHighlightedCell}
          />
        ))}
    </tr>
  );
}

function TableCell({row, column, highlightedCell, setHighlightedCell}) {
  const isHighlighted =
    highlightedCell.row === row || highlightedCell.column === column;

  const wrapSetter = useContext(HarnessContext);
  return (
    <td
      onMouseEnter={wrapSetter(() => setHighlightedCell({row, column}))}
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
