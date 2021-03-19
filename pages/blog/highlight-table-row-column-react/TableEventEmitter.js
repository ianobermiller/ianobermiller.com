import React, {useEffect, useState, useContext} from 'react';
import {HarnessContext, ROWS, COLUMNS} from './Harness.js';

// Use an IIFE to contain the variable declarations. In a production
// app, I'd probably make this a class so you can test the instances,
// and also throw it into context to avoid the global.
const emitter = (() => {
  // 2d array indexed by row and column
  const subs = [];
  return {
    // Subscribe function that will be called once for each cell, in a
    // useEffect
    subscribe(r, c, cb) {
      subs[r] = subs[r] ?? [];
      // Note that this does not handle multiple subscriptions for the
      // same cell
      subs[r][c] = cb;
      // This will be invoked by useEffect's cleanup
      return () => delete subs[r][c];
    },
    // Called by each cell when it is hovered
    highlight(newRow, newCol) {
      subs.forEach((row, r) => {
        row.forEach((cb, c) => {
          const isHighlighted = r === newRow || c === newCol;
          // useState won't rerender the component if the value hasn't
          // changed, so we can call it for every cell
          cb(isHighlighted);
        });
      });
    },
  };
})();

function Table() {
  return (
    <table>
      <tbody>
        {Array(ROWS)
          .fill()
          .map((_, i) => (
            <TableRow key={i} row={i} />
          ))}
      </tbody>
    </table>
  );
}

const TableRow = React.memo(({row}) => {
  return (
    <tr>
      {Array(COLUMNS)
        .fill()
        .map((_, i) => (
          <TableCell key={i} row={row} column={i} />
        ))}
    </tr>
  );
});

function TableCell({row, column}) {
  const [isHighlighted, setIsHighlighted] = useState(false);
  useEffect(() => {
    return emitter.subscribe(row, column, setIsHighlighted);
  }, [column, row]);
  const wrapSetter = useContext(HarnessContext);
  return (
    <td
      onMouseEnter={wrapSetter(() => emitter.highlight(row, column))}
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
