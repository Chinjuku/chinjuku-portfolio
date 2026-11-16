import { createContext, useContext } from 'react';

// Kept apart from ThemeProvider (a component file) so React Fast Refresh can
// hot-reload the provider: a .tsx file should only export components.

export type Theme = 'dark' | 'light' | 'system';

export type ThemeProviderState = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
    theme: 'system',
    setTheme: () => null,
};

export const ThemeContext = createContext<ThemeProviderState>(initialState);

export const useTheme = () => {
    const context = useContext(ThemeContext);

    if (context === undefined)
        throw new Error('useTheme must be used within a ThemeProvider');

    return context;
};
