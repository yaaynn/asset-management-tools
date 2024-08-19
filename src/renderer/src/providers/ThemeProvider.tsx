import { createContext, JSX, useContext, useState } from 'react'

export interface ThemeProviderProps {
  isDark: boolean
  toggleDark?: (dark: boolean) => void
}
const defaultProps: ThemeProviderProps = {
  isDark: false
}

export const ThemeContext = createContext<ThemeProviderProps>(defaultProps)

export const ThemeProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
  const [isDark, setIsDark] = useState<boolean>(false)
  function toggleDark(dark: boolean): void {
    setIsDark(dark)
  }
  return <ThemeContext.Provider value={{ isDark, toggleDark }}>{children}</ThemeContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => useContext(ThemeContext)
