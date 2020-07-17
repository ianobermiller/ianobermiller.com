import styled from '@emotion/styled';
import React, {ReactElement, useEffect, useState} from 'react';

type StockyardsData = {
  date: string;
  quotes: {[name: string]: {low: number; high: number}};
};

export default function DansQuotes(): ReactElement {
  const [stockyardsData, setStockyardsData] = useState<StockyardsData | null>(
    null,
  );
  useEffect(() => {
    fetch('https://wrapapi.com/use/ianobermiller/dan/cattle/0.0.4', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        wrapAPIKey: 'BbtXPB9mD1UIvkkZ6npxlwVfpnFoNmaL',
      }),
    })
      .then(res => res.json())
      .then(json => setStockyardsData(json.data));
  }, []);

  if (!stockyardsData) {
    return null;
  }

  const {date, quotes} = stockyardsData;

  return (
    <Root>
      <Heading>Milwaukee Stockyards</Heading>
      <i>{date}</i>
      <table>
        {Object.entries(quotes).map(([name, prices]) => (
          <tr>
            <td style={{width: 200}}>{name}</td>
            <td>
              {prices.low} to {prices.high}
            </td>
          </tr>
        ))}
      </table>
    </Root>
  );
}

const Root = styled.main`
  padding: 0 8px;
`;

const Heading = styled.h1`
  margin: 8px 0;
`;
