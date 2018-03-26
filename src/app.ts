import './style/style'
import { Editor } from './editor/editor'
import { EditorInput } from './editor/interfaces'
import 'svg.draggable.js'

window.onload = function() {
  const editor = new Editor(<EditorInput>{
    pathInput: document.getElementById('pathInput'),
    scale: document.getElementById('scale'),
    transX: document.getElementById('transX'),
    transY: document.getElementById('transY'),
    rotate: document.getElementById('rotate'),
    output: document.getElementById('output'),
  })
}

document.getElementById('copyButton').addEventListener('click', () => {
  const output = document.querySelector('#output')
  const range = document.createRange()
  range.selectNode(output)
  window.getSelection().addRange(range)
  const successful = document.execCommand('copy')
  alert(`Path copied: ${output.textContent}`)
  window.getSelection().removeAllRanges()
})
