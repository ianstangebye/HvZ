import { createTheming } from '@callstack/react-theme-provider';
const { ThemeProvider, withTheme } = createTheming({
  primaryColor: 'red',
  secondaryColor: 'green',
});
export { ThemeProvider, withTheme };