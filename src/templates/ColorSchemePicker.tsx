import React, {ReactElement, useState} from 'react';
import {FaMoon, FaSun} from 'react-icons/fa';

export default function ColorSchemePicker(): ReactElement {
  const [isDark, setIsDark] = useState(false);
  return (
    <div onClick={() => setIsDark(isDark => !isDark)}>
      {isDark ? <FaMoon /> : <FaSun />}
    </div>
  );
}
