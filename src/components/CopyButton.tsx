import { Component, createSignal } from 'solid-js'

export const CopyButton: Component<{ label: string; copyText: string }> = (
  props
) => {
  const [label, setLabel] = createSignal(props.label)

  const handleCopy = () => {
    navigator.clipboard.writeText(props.copyText)

    setLabel('Copied!')
    setTimeout(() => {
      setLabel(props.label)
    }, 700)
  }

  return (
    <button
      class="p-2 border w-full hover:text-kodot-blue hover:border-kodot-blue hover:cursor-pointer"
      onClick={handleCopy}
    >
      {label()}
    </button>
  )
}
