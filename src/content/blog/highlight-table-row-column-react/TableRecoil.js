import React, {useContext} from 'react';
import {
  RecoilRoot,
  atom,
  atomFamily,
  useRecoilCallback,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import {HarnessContext, ROWS, COLUMNS} from './Harness.js';

const currentHighlightedCellState = atom({
  key: 'currentHighlightedCell',
  default: {row: -1, column: -1},
});
const isHighlightedStateFamily = atomFamily({
  key: 'isHighlighted',
  default: false,
});

function Table() {
  return (
    <RecoilRoot>
      <table>
        <tbody>
          {Array(ROWS)
            .fill()
            .map((_, i) => (
              <TableRow key={i} row={i} />
            ))}
        </tbody>
      </table>
    </RecoilRoot>
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
  const isHighlighted = useRecoilValue(
    isHighlightedStateFamily({row, column}),
  );

  const onMouseEnter = useRecoilCallback(
    ({snapshot: {getLoadable}, set, reset}) => () => {
      const {row: oldRow, column: oldColumn} = getLoadable(
        currentHighlightedCellState,
      ).contents;
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLUMNS; c++) {
          const atom = isHighlightedStateFamily({
            row: r,
            column: c,
          });
          if (r === row || c === column) {
            set(atom, true);
          } else if (r === oldRow || c === oldColumn) {
            reset(atom);
          }
        }
      }
      set(currentHighlightedCellState, {row, column});
    },
  );

  const wrapSetter = useContext(HarnessContext);
  return (
    <td
      onMouseEnter={wrapSetter(onMouseEnter, 2)}
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
