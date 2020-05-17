import styled from '@emotion/styled';
import React, {ReactElement, useState} from 'react';
import {FaMoon, FaSun} from 'react-icons/fa';

export default function ColorSchemePicker(): ReactElement {
  const [isDark, setIsDark] = useState(false);
  return (
    <Button onClick={() => setIsDark(isDark => !isDark)}>
      {isDark ? (
        <FaMoon color="currentColor" size={16} title="Switch to Light mode" />
      ) : (
        <FaSun color="currentColor" size={16} title="Switch to Dark mode" />
      )}
    </Button>
  );
}

const Button = styled.button`
  background: transparent;
  border: none;
  color: inherit;
  position: absolute;
  right: 0;
  top: 0;
`;
