import { useNavigate, useRoutes } from 'react-router-dom'
import { routes } from './routes'
import { JSX, useEffect, useRef } from 'react'
import { useTheme } from './providers/ThemeProvider'
import { GlobalConfig } from '../../utils/interfaces'
import { SnackbarProvider } from 'notistack'
import MultiPop from './assets/music/multi-pop-1-188165.mp3'

function App(): JSX.Element {
  const element = useRoutes(routes)
  const theme = useTheme()
  const navigate = useNavigate()

  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (window.api) {
      const globalConfig: GlobalConfig = window.api.getGlobalConfig()
      if (!globalConfig.workingMode) {
        navigate('/mode-config')
      }
    }
  }, [])

  async function handlerEnter(): Promise<void> {
    if (audioRef?.current) {
      const audio = audioRef.current
      await audio?.play()
    }
  }

  return (
    <>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        autoHideDuration={3000}
        onEnter={handlerEnter}
      >
        <audio ref={audioRef} style={{ display: 'none' }}>
          <source src={MultiPop} type="audio/mpeg" />
        </audio>
        <div className={`${theme.isDark ? 'dark' : 'light'} bg-white dark:bg-black container-body`}>
          {element}
        </div>
      </SnackbarProvider>
    </>
  )
}

export default App
