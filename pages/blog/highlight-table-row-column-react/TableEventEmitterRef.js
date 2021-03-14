import {css, Global} from '@emotion/react';
import React, {useContext, useEffect, useRef} from 'react';
import {COLUMNS, HarnessContext, ROWS} from './Harness.js';

// Use an IIFE to contain the variable declarations. In a production
// app, I'd probably make this a class so you can test the instances,
// and also throw it into context to avoid the global.
const emitter = (() => {
  // Keep track of the currently highlighted row and column
  let currentRow = -1;
  let currentCol = -1;
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
          const wasHighlighted = r === currentRow || c === currentCol;
          const isHighlighted = r === newRow || c === newCol;
          // Only notify if the highlighting for this row has changed.
          // We could optimize this loop to only run for the changed
          // rows, but you're unlikely to see noticable gains.
          if (wasHighlighted !== isHighlighted) {
            cb(isHighlighted);
          }
        });
      });

      // Update the currently highlighted cell, otherwise you'll never
      // unhighlight the old ones.
      currentRow = newRow;
      currentCol = newCol;
    },
  };
})();

function Table() {
  return (
    <>
      <Global
        styles={css`
          .highlight-cell {
            background: var(--text-color);
            color: var(--background-color);
          }
        `}
      />
      <table>
        <tbody>
          {Array(ROWS)
            .fill()
            .map((_, i) => (
              <TableRow key={i} row={i} />
            ))}
        </tbody>
      </table>
    </>
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
  const ref = useRef();
  useEffect(() => {
    emitter.subscribe(row, column, isHighlighted => {
      if (ref.current) {
        // Directly update the class on the DOM node
        ref.current.classList.toggle('highlight-cell', isHighlighted);
      }
    });
  }, [column, row]);
  const wrapSetter = useContext(HarnessContext);
  return (
    <td
      onMouseEnter={wrapSetter(() => emitter.highlight(row, column))}
      ref={ref}>
      {row}x{column}
    </td>
  );
}

export default Table;
