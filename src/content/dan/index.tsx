import styled from '@emotion/styled';
import React, {ReactElement, useEffect, useState} from 'react';
import {Helmet} from 'react-helmet';
import '../../templates/areset.css';
import '../../templates/layout.scss';

export default function DansQuotes(): ReactElement {
  return (
    <Root>
      <Helmet htmlAttributes={{lang: 'en'}}>
        <title>Dan's Quotes</title>
      </Helmet>
      <Stockyards />
      <Agro />
    </Root>
  );
}

type StockyardsData = {
  date: string;
  quotes: {[name: string]: {low: number; high: number}};
};

function Stockyards(): ReactElement {
  const data = useWrapAPI<StockyardsData>('dan/cattle/0.0.4');

  if (!data) {
    return null;
  }

  const {date, quotes} = data;

  return (
    <>
      <Heading>
        <a href="http://milwaukeestockyards.com/index.cfm?show=10&mid=15">
          Milwaukee Stockyards
        </a>
      </Heading>
      <i>{date}</i>
      <table>
        {Object.entries(quotes).map(([name, prices]) => (
          <tr>
            <Name>{name}</Name>
            <td>
              {prices.low} to {prices.high}
            </td>
          </tr>
        ))}
      </table>
    </>
  );
}

const INCLUDE_AGRO: {[name: string]: boolean} = {
  'Corn Futures': true,
  'Chicago SRW Wheat Futures': true,
  'Soybean Futures': true,
};

type AgroData = {
  quotes: [
    {
      last: string;
      change: string;
      name: string;
      updated: string;
    },
  ];
};

function Agro(): ReactElement {
  const data = useWrapAPI<AgroData>('dan/agro/0.0.2');

  if (!data) {
    return null;
  }

  return (
    <>
      <Heading>
        <a href="https://www.cmegroup.com/trading/agricultural/#grainsAndOilseeds">
          CME Futures
        </a>
      </Heading>
      <i>{data.quotes[0].updated.replace('<br />', '')}</i>
      <table>
        {data.quotes
          .filter(({name}) => INCLUDE_AGRO[name])
          .map(({name, last, change}) => (
            <tr>
              <Name>{name.replace(' Futures', '')}</Name>
              <td>
                {last}{' '}
                <span style={{color: change.startsWith('-') ? 'red' : 'green'}}>
                  {change}
                </span>
              </td>
            </tr>
          ))}
      </table>
    </>
  );
}

const Root = styled.main`
  padding: 0 8px;
`;

const Heading = styled.h1`
  margin: 8px 0;
`;

const Name = styled.td`
  width: 200px;
`;

function useWrapAPI<T>(path: string): T | null {
  const [data, setData] = useState<T | null>(null);
  useEffect(() => {
    fetch('https://wrapapi.com/use/ianobermiller/' + path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        wrapAPIKey: 'BbtXPB9mD1UIvkkZ6npxlwVfpnFoNmaL',
      }),
    })
      .then(res => res.json())
      .then(json => setData(json.data));
  }, []);
  return data;
}
