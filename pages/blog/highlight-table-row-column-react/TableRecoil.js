import React, {useContext} from 'react';
import {
  atom,
  useRecoilValue,
  useSetRecoilState,
  selectorFamily,
  RecoilRoot,
} from 'recoil';
import {HarnessContext, ROWS, COLUMNS} from './Harness.js';

const highlightedCell = atom({
  key: 'highlightedCell',
  default: {row: -1, column: -1},
});

const isHighlightedSelector = selectorFamily({
  key: 'isHighlightedSelector',
  get: ({row, column}) => ({get}) => {
    const h = get(highlightedCell);
    return h.row === row || h.column === column;
  },
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
  console.count('row render');
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
  console.count('tcell render');
  const isHighlighted = useRecoilValue(isHighlightedSelector({row, column}));
  const setHighlight = useSetRecoilState(highlightedCell);
  const wrapSetter = useContext(HarnessContext);
  return (
    <td
      onMouseEnter={wrapSetter(() => setHighlight({row, column}), 2)}
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
