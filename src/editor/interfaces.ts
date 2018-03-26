export interface EditorInput {
  pathInput: HTMLTextAreaElement
  scale: HTMLInputElement
  transX: HTMLInputElement
  transY: HTMLInputElement
  rotate: HTMLInputElement
  output: HTMLPreElement
  svg?: SVGElement
}

export interface SVGData {
  pathInput: string
  scale: number
  transX: number
  transY: number
  rotate: number
}
