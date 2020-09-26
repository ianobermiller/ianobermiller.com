import Document, {
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document';

// This small snippet runs before the page renders and sets a class on the
// root element if the stored theme does not match the OS preference.
// Idea from https://joshwcomeau.com/gatsby/dark-mode/
const codeToRunOnClient = `
    (function() {
      const localValue = localStorage.getItem('color-scheme');
      const osValue = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      if (localValue && localValue !== osValue) {
        document.documentElement.classList.add(localValue);
      }
    })();
  `;

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(
      ctx,
    );
    return {...initialProps};
  }

  render() {
    return (
      <Html lang="en">
        <Head />
        <body>
          <script
            dangerouslySetInnerHTML={{
              __html: codeToRunOnClient,
            }}
          />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
