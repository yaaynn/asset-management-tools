import { CSSProperties, JSX } from 'react'
import Spin from '../assets/icons/Spin.svg'

export interface LoadingProps {
  loading: boolean // 是否显示加载动画
  fullscreen?: boolean
  className?: string
  children?: JSX.Element
  text?: string
  zIndex?: number
  width?: string
  height?: string
}
export const Loading = (props: LoadingProps): JSX.Element => {
  const zIndex = props.zIndex ?? 19951217
  const loadingStyle: CSSProperties = {
    zIndex: zIndex
  }
  if (props.width) {
    loadingStyle.width = props.width
  }
  if (props.height) {
    loadingStyle.height = props.height
  }

  function renderLoading(): JSX.Element {
    return (
      <div className={`flex flex-col justify-center items-center inline-block w-full h-full`}>
        <img src={Spin} style={{ width: '64px', height: '64px' }} />
        <div className={`mt-3`}>{props.text}</div>
      </div>
    )
  }

  if (props.loading) {
    if (props.fullscreen) {
      /*ReactDOM.createPortal(<Loading loading={props.loading} />, document.body)*/
      /*ReactDOM.createParent(
        <div className={`fixed top-0 left-0 wv-full hv-full`} style={loadingStyle}>
          {renderLoading()}
        </div>,
        document.body
      )*/
      loadingStyle.width = '100vw'
      loadingStyle.height = '100vh'

      return (
        <>
          {props.children}
          <div
            style={loadingStyle}
            className={`fixed top-0 left-0 bg-black bg-opacity-30 flex justify-center items-center text-white`}
          >
            {renderLoading()}
          </div>
        </>
      )
    } else {
      return (
        <>
          <div className={`relative`}>
            {props.children}
            <div
              className={`absolute top-0 bottom-0 left-0 right-0 bg-black bg-opacity-30 flex justify-center items-center text-white`}
            >
              {renderLoading()}
            </div>
          </div>
        </>
      )
    }
  }
  return <>{props.children}</>
}
