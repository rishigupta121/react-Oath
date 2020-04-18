import React from 'react';

export const themes = {
    standard: {
        primaryColor: '#1EB4E6',
        background: '#FFFFFF',
    }
};

export const ThemeContext = React.createContext({
    theme: themes.standard,
    changeTheme: () => {},
});