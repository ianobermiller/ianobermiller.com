import styled from '@emotion/styled';
import React from 'react';
import data from './js-error-logging-bundle-size.json';

export default function JSErrorLoggingBundleSizeTable() {
  return (
    <Table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Min+Gzip kB</th>
          <th>Source</th>
          <th>Updated</th>
        </tr>
      </thead>
      <tbody>
        {data.map((entry, index) => (
          <tr key={index}>
            <td>
              <a href={entry.url}>{entry.name}</a>
            </td>
            <td align="center">{entry.minzipSizeInKB}</td>
            <td>
              {entry.source.startsWith('http') ? (
                <a href={entry.source}>{entry.source}</a>
              ) : (
                <pre>{entry.source}</pre>
              )}
            </td>
            <td>{new Date(entry.lastUpdated * 1000).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

const Table = styled.table`
  th {
    font-weight: bold;
    text-align: left;
    white-space: nowrap;
  }

  th,
  td {
    &:not(:last-child) {
      padding-right: 16px;
    }
  }
`;
