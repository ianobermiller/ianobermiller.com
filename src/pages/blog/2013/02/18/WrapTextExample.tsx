import {ReactElement, useState} from 'react';
import React from 'react';

function prettyPrint(text: string, lineLength: number) {
  var words = text.split(' ');
  var lengths = words.map(function(w: {length: any}) {
    return w.length;
  });
  var opt = [];
  var index = [];
  for (var j = 0; j < words.length; j++) {
    // Let i be the index that minimizes the expression slack(i, j) + opt[i – 1]
    var minIndex = -1;
    var minError = Number.MAX_VALUE;
    for (var i = 0; i <= j; i++) {
      // Sum the lengths of words from i to j
      var len =
        sum(
          lengths.slice(i, j + 1).map(function(n) {
            return n + 1;
          }),
        ) - 1;

      // Slack is the distance from the end of the line
      var slack = lineLength - len;

      // If it is negative, we have picked up too many words
      if (slack < 0) continue;

      // Error is equal to the slack squared plus the previous optimal error
      var error = slack * slack;
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
  var x = words.length - 1;
  var lines = [];
  while (x >= 0) {
    // Add line consisting of words from index[x] to x
    lines.unshift(words.slice(index[x], x + 1).join(' '));
    x = index[x] - 1;
  }
  return lines.join('\n');
}

function sum(numbers: number[]) {
  var s = 0;
  for (var i = 0; i < numbers.length; i++) {
    s += numbers[i];
  }
  return s;
}

interface Props {
  lineLength: number;
  text: string;
}

const letterWidth = 8;

function WrapText(props: Props): ReactElement {
  const text = prettyPrint(props.text, props.lineLength);
  return (
    <div style={{position: 'relative'}}>
      <pre>{text}</pre>
      <div
        style={{
          borderLeft: 'solid 1px red',
          width: 0,
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: letterWidth * props.lineLength,
        }}
      />
    </div>
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
          onChange={e => setLineLength((e.target as HTMLInputElement).value)}
          value={lineLength}
        />
      </p>

      <h2>Text</h2>
      <p>
        <textarea
          onChange={e => setText((e.target as HTMLTextAreaElement).value)}
          style={{width: '100%'}}
          value={text}
        />
      </p>

      <h2>Formatted text</h2>
      <WrapText lineLength={lineLength} text={text} />
    </>
  );
}
