import type { Component } from 'solid-js'
import { createSignal, For, Show } from 'solid-js'
import { optimizeImage } from '../utils'
import { CopyButton } from './CopyButton'

type Info = {
  url: string
  width: number
  height: number
  blobUrl: string
}

export const ImageUploader: Component<{ token: string | null }> = (props) => {
  const [uploading, setUploading] = createSignal(false)
  const [imageInfo, setImageInfo] = createSignal<Array<Info>>([])
  let inputRef!: HTMLInputElement

  const handleFile = async (file: File | null | undefined) => {
    if (!file) {
      return
    }

    if (!/image\/(jpe?g|png|gif|webp)/.test(file.type)) {
      alert('許可された画像を選択してください。')
      return
    }

    setUploading(true)

    const optimizedImage = await optimizeImage(file)

    const response = await fetch(
      import.meta.env.VITE_API_BASE_URL + '/upload',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'image/webp',
          Authorization: `token ${props.token}`,
        },
        mode: 'cors',
        body: optimizedImage,
      }
    )

    setUploading(false)

    if (!response.ok) {
      alert('画像のアップロードに失敗しました。')
    }

    const { id, width, height } = await response.json()

    setImageInfo([
      ...imageInfo(),
      {
        url: `${import.meta.env.VITE_IMAGE_BASE_URL}/${id}`,
        width,
        height,
        blobUrl: URL.createObjectURL(
          new Blob([optimizedImage], { type: 'image/webp' })
        ),
      },
    ])
  }

  const handleDrop = (event: DragEvent) => {
    event.preventDefault()
    const file = event.dataTransfer?.files[0]
    handleFile(file)
  }

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault()
  }

  const handleFileInputChange = (event: Event) => {
    const target = event.target as HTMLInputElement | null
    const file = target?.files?.[0]
    handleFile(file)
  }

  const linkText = (url: string) => {
    return `![](${url})`
  }

  const coverText = (info: Info) => {
    return (
      `cover:\n` +
      `  url: ${info.url}\n` +
      `  width: ${info.width}\n` +
      `  height: ${info.height}\n`
    )
  }

  return (
    <>
      <div
        class="h-64 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-500 hover:border-kodot-blue hover:text-kodot-blue transition-colors cursor-pointer"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => inputRef.click()}
      >
        クリックかファイルをドロップしてアップロード
        <br />
        画像形式: jpg / jpeg / png / gif / webp
      </div>
      <Show when={uploading()}>
        <div class="text-center">Uploading...</div>
      </Show>

      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.gif,.webp"
        class="hidden"
        onChange={handleFileInputChange}
      />

      <div class="grid grid-cols-4 gap-4 mt-4">
        <For each={imageInfo()}>
          {(info) => (
            <div>
              <img class="object-contain" src={info.blobUrl} />
              <CopyButton
                label="本文用テキストをコピー"
                copyText={linkText(info.url)}
              />
              <CopyButton
                label="カバー用テキストをコピー"
                copyText={coverText(info)}
              />
            </div>
          )}
        </For>
      </div>
    </>
  )
}
