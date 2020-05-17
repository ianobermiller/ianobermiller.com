const Script = () => {
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
  return <script dangerouslySetInnerHTML={{__html: codeToRunOnClient}} />;
};

export const onRenderBody = ({setPreBodyComponents}) => {
  setPreBodyComponents(<Script />);
};
