import type {AppProps} from 'next/app';
import 'src/templates/areset.css';
import 'src/templates/layout.scss';

function MyApp({Component, pageProps}: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
