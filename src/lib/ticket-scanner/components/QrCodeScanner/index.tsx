import { Html5QrcodeResult, Html5QrcodeScanner } from "html5-qrcode"
import { useEffect } from "react"

const qrcodeRegionId = "html5qr-code-full-region"

type Props = {
  fps: number
  qrbox: number
  verbose?: boolean
  aspectRatio?: number
  disableFlip?: boolean
  qrCodeSuccessCallback?: (
    decodedText: string,
    result: Html5QrcodeResult
  ) => void
  qrCodeErrorCallback?: () => void
}

// Creates the configuration object for Html5QrcodeScanner.
const createConfig = (props: Props) => {
  let config: Props = {
    fps: 0,
    qrbox: 0,
    verbose: false,
  }
  if (props.fps) {
    config.fps = props.fps
  }
  if (props.qrbox) {
    config.qrbox = props.qrbox
  }
  if (props.aspectRatio) {
    config.aspectRatio = props.aspectRatio
  }
  if (props.disableFlip !== undefined) {
    config.disableFlip = props.disableFlip
  }
  return config
}

const QrCodeScanner = (props: Props) => {
  useEffect(() => {
    // when component mounts
    const config = createConfig(props)
    const verbose = props.verbose === true
    // Suceess callback is required.
    if (!props.qrCodeSuccessCallback) {
      throw "qrCodeSuccessCallback is required callback."
    }
    const html5QrcodeScanner = new Html5QrcodeScanner(
      qrcodeRegionId,
      config,
      verbose
    )
    html5QrcodeScanner.render(
      props.qrCodeSuccessCallback,
      props.qrCodeErrorCallback
    )

    // cleanup function when component will unmount
    return () => {
      html5QrcodeScanner.clear().catch((error) => {
        console.error("Failed to clear html5QrcodeScanner. ", error)
      })
    }
  }, [props])

  return (
    <div
      id={qrcodeRegionId}
      className="bg-white mt-28 w-9/12 mx-auto h-72 rounded-2xl"
    />
  )
}

export default QrCodeScanner
