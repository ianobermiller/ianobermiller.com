import React, {
  Suspense,
  useMemo,
  useRef,
  useState,
} from 'react';

function Harness({children}) {
  const [isVisible, setVisible] = useState(false);
  const timingRef = useRef();
  const wrapSetter = useMemo(() => {
    let total = 0;
    let count = 0;
    return function wrapSetter(fn, rafCount = 1) {
      return () => {
        const start = performance.now();
        const recordTime = () => {
          const elapsed = performance.now() - start;
          total += elapsed;
          count++;
          const avg = Math.round(total / count);
          timingRef.current.innerText = `Average time (ms): ${avg}, Count: ${count}`;
        };

        if (rafCount === 1) {
          requestAnimationFrame(recordTime);
        } else {
          requestAnimationFrame(() =>
            requestAnimationFrame(recordTime),
          );
        }
        fn();
      };
    };
  }, []);
  return (
    <div style={STYLE}>
      <div ref={timingRef} />
      {isVisible ? (
        <HarnessContext.Provider value={wrapSetter}>
          <Suspense fallback="Loading...">
            {children}
          </Suspense>
        </HarnessContext.Provider>
      ) : (
        <button onClick={() => setVisible(true)}>
          Render example
        </button>
      )}
    </div>
  );
}

const STYLE = {
  margin: '1em auto',
  maxHeight: 300,
  overflow: 'auto',
};

export const HarnessContext = React.createContext();

export const ROWS = 200;
export const COLUMNS = 30;

export default Harness;
