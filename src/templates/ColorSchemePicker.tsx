import styled from '@emotion/styled';
import React, {ReactElement, useState} from 'react';
import {FaMoon, FaSun} from 'react-icons/fa';

const DARK_CLASS = 'dark';
const LIGHT_CLASS = 'light';

function doesPreferDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Shows a color scheme toggle. If your OS prefers dark mode, and you set the
 * toggle to light mode, it will save your preference to local storage. If you
 * toggle it back to dark mode, it will remove the preference and follow the OS
 * once again.
 */
export default function ColorSchemePicker(): ReactElement {
  // Don't render during SSR
  if (!window) {
    return null;
  }

  const {classList} = document.documentElement;
  const [isDark, setIsDark] = useState(
    // Detect if an override has been applied
    classList.contains(DARK_CLASS) ||
      (doesPreferDark() && !classList.contains(LIGHT_CLASS)),
  );
  function toggleIsDark() {
    if (isDark) {
      classList.remove(DARK_CLASS);
      if (doesPreferDark()) {
        classList.add(LIGHT_CLASS);
        localStorage.setItem('color-scheme', LIGHT_CLASS);
      } else {
        localStorage.removeItem('color-scheme');
      }
    } else {
      classList.remove(LIGHT_CLASS);
      if (!doesPreferDark()) {
        classList.add(DARK_CLASS);
        localStorage.setItem('color-scheme', DARK_CLASS);
      } else {
        localStorage.removeItem('color-scheme');
      }
    }
    setIsDark(!isDark);
  }
  return (
    <Button onClick={toggleIsDark}>
      {isDark ? (
        <FaMoon color="currentColor" size={16} title="Switch to Light mode" />
      ) : (
        <FaSun color="currentColor" size={16} title="Switch to Dark mode" />
      )}
    </Button>
  );
}

const Button = styled.button`
  align-items: center;
  background: transparent;
  border-radius: 50%;
  border: none;
  color: inherit;
  cursor: pointer;
  display: flex;
  height: var(--grid-size);
  justify-content: center;
  outline: none;
  position: absolute;
  right: var(--grid-size);
  top: var(--grid-size);
  width: var(--grid-size);

  &:focus {
    box-shadow: 0 0 6px 0 var(--accent-color);
  }
`;
