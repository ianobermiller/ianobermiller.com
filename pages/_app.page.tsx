import type {AppProps} from 'next/app';
import React from 'react';
import '../layouts/areset.css';
import '../layouts/layout.scss';

function MyApp({Component, pageProps}: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
