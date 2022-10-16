import {ReactElement, useState} from 'react';
import React from 'react';

function prettyPrint(text: string, lineLength: number) {
  const words = text.split(' ');
  const lengths = words.map(w => w.length);
  const opt: number[] = [];
  const index: number[] = [];

  for (let j = 0; j < words.length; j++) {
    // Let i be the index that minimizes the expression slack(i, j) + opt[i – 1]
    let minIndex = -1;
    let minError = Number.MAX_VALUE;
    for (let i = 0; i <= j; i++) {
      // Sum the lengths of words from i to j
      const len =
        sum(
          lengths.slice(i, j + 1).map(function (n) {
            return n + 1;
          }),
        ) - 1;

      // Slack is the distance from the end of the line
      const slack = lineLength - len;

      // If it is negative, we have picked up too many words
      if (slack < 0) continue;

      // Error is equal to the slack squared plus the previous optimal error
      let error = slack * slack;
      if (i > 0) error += opt[i - 1];

      // Save only the lowest error
      if (error < minError) {
        minError = error;
        minIndex = i;
      }
    }
    opt[j] = minError;
    index[j] = minIndex;
  }

  // The minimum slack will be in opt[n – 1]
  // To reconstruct the lines:
  let x = words.length - 1;
  const lines: string[] = [];
  while (x >= 0) {
    // Add line consisting of words from index[x] to x
    lines.unshift(words.slice(index[x], x + 1).join(' '));
    x = index[x] - 1;
  }
  return lines.join('\n');
}

function sum(numbers: number[]) {
  let s = 0;
  for (let i = 0; i < numbers.length; i++) {
    s += numbers[i];
  }
  return s;
}

interface Props {
  lineLength: number;
  text: string;
}

function WrapText(props: Props): ReactElement {
  const text = prettyPrint(props.text, props.lineLength);
  return (
    <pre style={{position: 'relative'}}>
      {text}
      <div
        style={{
          borderLeft: 'solid 1px red',
          width: 0,
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: `calc(1ch * ${props.lineLength})`,
        }}
      />
    </pre>
  );
}

export default function WrapTextExample(props: Props): ReactElement {
  const [lineLength, setLineLength] = useState(props.lineLength);
  const [text, setText] = useState(props.text);
  return (
    <>
      <h2>Line length</h2>
      <p>
        <input
          type="number"
          onChange={e => setLineLength(Number(e.target.value))}
          value={lineLength}
        />
      </p>

      <h2>Text</h2>
      <p>
        <textarea
          onChange={e => setText(e.target.value)}
          style={{
            boxSizing: 'border-box',
            display: 'block',
            height: '96px',
            width: '100%',
          }}
          value={text}
        />
      </p>

      <h2>Formatted text</h2>
      <WrapText lineLength={lineLength} text={text || ''} />
    </>
  );
}
