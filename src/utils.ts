import Vips from 'wasm-vips'
let vips: typeof Vips

export const loadVips = () => {
  // @ts-ignore-next-line
  window?.Vips().then((v) => {
    vips = v
  })
}

export const optimizeImage = async (file: File): Promise<Uint8Array> => {
  const inputOptions = file.type === 'image/gif' ? { n: -1 } : {}

  const outputOptions = /image\/jpe?g/.test(file.type)
    ? { Q: 80 }
    : { lossless: true }

  const buffer = await file.arrayBuffer()
  const inputImage = vips.Image.newFromBuffer(buffer, '', inputOptions as any)

  return inputImage.writeToBuffer('.webp', outputOptions)
}
