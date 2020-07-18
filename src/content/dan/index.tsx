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

const INCLUDE_CATTLE = ['Prime Holstein Steers', 'Premium Bulls'];

type StockyardsData = {
  date: string;
  quotes: [{name: string; low: string; high: string}];
};

function Stockyards(): ReactElement {
  const data = useWrapAPI<StockyardsData>('milwaukeestockyards/quotes/0.0.9');

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
        <tbody>
          {quotes
            .filter(({name}) => INCLUDE_CATTLE.some(n => name.includes(n)))
            .map(({name, low, high}) => (
              <tr key={name}>
                <Name>{INCLUDE_CATTLE.find(n => name.includes(n))}</Name>
                <td>
                  {low} to {high}
                </td>
              </tr>
            ))}
        </tbody>
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
  const data = useWrapAPI<AgroData>('dan/agro/0.0.2')?.data;

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
        <tbody>
          {data.quotes
            .filter(({name}) => INCLUDE_AGRO[name])
            .map(({name, last, change}) => (
              <tr key={name}>
                <Name>{name.replace(' Futures', '')}</Name>
                <td>
                  {last}{' '}
                  <span
                    style={{color: change.startsWith('-') ? 'red' : 'green'}}>
                    {change}
                  </span>
                </td>
              </tr>
            ))}
        </tbody>
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
      .then(setData);
  }, []);
  return data;
}
