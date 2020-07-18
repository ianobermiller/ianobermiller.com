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
      <Table>
        <tbody>
          <Stockyards />
          <Agro />
        </tbody>
      </Table>
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
      <tr>
        <td colSpan={2}>
          <Heading>
            <a href="http://milwaukeestockyards.com/index.cfm?show=10&mid=15">
              Milwaukee Stockyards
            </a>
          </Heading>
        </td>
      </tr>
      <DateRow>{date}</DateRow>
      {quotes
        .filter(({name}) => INCLUDE_CATTLE.some(n => name.includes(n)))
        .map(({name, low, high}) => (
          <tr key={name}>
            <td>{INCLUDE_CATTLE.find(n => name.includes(n))}</td>
            <td>
              {low} to {high}
            </td>
          </tr>
        ))}
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
      expirationMonth: string;
      last: string;
      change: string;
      name: string;
      updated: string;
    },
  ];
};

function Agro(): ReactElement {
  const data = useWrapAPI<AgroData>('cme/grain-and-oilseed/0.0.3');

  if (!data) {
    return null;
  }

  return (
    <>
      <tr>
        <td colSpan={2}>
          <Heading>
            <a href="https://www.cmegroup.com/trading/agricultural/#grainsAndOilseeds">
              CME Futures
            </a>
          </Heading>
        </td>
      </tr>
      <DateRow>{data.quotes[0].updated.replace('<br />', '')}</DateRow>
      {data.quotes
        .filter(({name}) => INCLUDE_AGRO[name])
        .map(({name, last, change}) => (
          <tr key={name}>
            <td>{name.replace(' Futures', '')}</td>
            <td>
              {last}{' '}
              <span style={{color: change.startsWith('-') ? 'red' : 'green'}}>
                {change}
              </span>
            </td>
          </tr>
        ))}
    </>
  );
}

function DateRow({children}: {children: string}) {
  return (
    <tr>
      <DateCell colSpan={2}>{children}</DateCell>
    </tr>
  );
}

const Root = styled.main`
  font-size: 24px;
  font-size: 6vw;
  line-height: 1.2;
  padding: 0 8px;
`;

const Heading = styled.h1`
  font-size: 32px;
  font-size: 10vw;
  line-height: 1.2;
  margin: 8px 0;
`;

const Table = styled.table`
  width: 100%;
`;

const DateCell = styled.td`
  font-size: 20px;
  font-size: 4vw;
  font-style: italic;
  padding-bottom: 8px;
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
