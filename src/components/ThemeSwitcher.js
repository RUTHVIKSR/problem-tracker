import React from 'react';
import { useApp } from '../contexts/AppContext';

const ThemeSwitcher = () => {
  const { state, actions } = useApp();

  const handleThemeChange = (e) => {
    actions.setTheme(e.target.checked ? 'dark' : 'light');
  };

  return (
    <div className="theme-switcher-container">
      <span>Dark Mode</span>
      <label className="switch">
        <input 
          type="checkbox" 
          checked={state.theme === 'dark'}
          onChange={handleThemeChange}
        />
        <span className="slider round"></span>
      </label>
    </div>
  );
};

export default ThemeSwitcher;
