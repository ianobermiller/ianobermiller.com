import React from 'react';
import {ROWS, COLUMNS} from './Harness.js';

function Table() {
  return (
    <table>
      <tbody>
        {
          // One-liner for _.range
          Array(ROWS)
            .fill()
            .map((_, i) => (
              <TableRow key={i} row={i} />
            ))
        }
      </tbody>
    </table>
  );
}

function TableRow({row}) {
  return (
    <tr>
      {Array(COLUMNS)
        .fill()
        .map((_, i) => (
          <TableCell key={i} row={row} column={i} />
        ))}
    </tr>
  );
}

function TableCell({row, column}) {
  return (
    <td>
      {row}x{column}
    </td>
  );
}

export default Table;
