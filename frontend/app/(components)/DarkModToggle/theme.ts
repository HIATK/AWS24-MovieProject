// utils/theme.ts
export const setDarkMode = () => {
    document.documentElement.classList.add('dark');
};

export const setLightMode = () => {
    document.documentElement.classList.remove('dark');
};

export const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
};

export const isDarkMode = () => {
    return document.documentElement.classList.contains('dark');
};