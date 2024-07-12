// components/ThemeToggle.tsx
'use client'
import React from 'react';
import styled from 'styled-components';
import { FaSun, FaMoon } from 'react-icons/fa';
import {useTheme} from "@/(components)/DarkModToggle/ThemeContext";

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 24px;
`;

const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <ToggleButton onClick={toggleTheme}>
            {theme === 'light' ? <FaMoon /> : <FaSun />}
        </ToggleButton>
    );
};

export default ThemeToggle;