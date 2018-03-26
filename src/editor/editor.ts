import { EditorInput, SVGData } from './interfaces'
import { Helper } from './helpers'
import { EditorFacade } from './editorFacade'
import * as SVG from 'svg.js'

export class Editor {
  private pathInput: HTMLTextAreaElement
  private output: HTMLPreElement
  private svgPath: SVG.Path
  private svgDoc: SVG.Doc
  constructor(private html: EditorInput) {
    this.pathInput = html.pathInput
    this.output = html.output
    this.svgPath = this.svgPath || new SVG.Path()

    for (const element in html) {
      if (
        (html.hasOwnProperty(element) &&
          html[element] instanceof HTMLTextAreaElement) ||
        html[element] instanceof HTMLInputElement
      ) {
        html[element].addEventListener('input', _ => {
          this.calculatePath()
        })
      }
    }

    this.svgDoc = SVG('svgOutput').viewbox(0, 0, 300, 300)
    this.calculatePath()
  }

  public addPoint() {
    const path = this.svgPath.array() as any
    const last = path.value.pop()
    if (last[0] == 'Z' || last[0] == 'z') {
      path.value.push(['L', 10, 10])
      path.value.push(last)
    } else {
      path.value.push(last)
      path.value.push(['L', 10, 10])
    }
    this.redraw(path)
  }

  private calculatePath(data = this.getRawValue()) {
    let path: SVG.PathArray
    this.output.textContent = ''
    const result = Helper.validateInput(data.pathInput)
    if (result.valid === false) {
      this.output.textContent = result.error
      return
    }
    path = EditorFacade.getTransformatedPath(data)
    this.redraw(path)
  }
  private redraw(path) {
    this.svgDoc.clear()
    this.svgDoc.add(this.svgPath)
    this.drawPath(path)
    this.attachAncors(path)
  }
  private drawPath(path: SVG.PathArray) {
    ;(<any>this.svgPath).clear()
    this.svgPath.plot(path)
    this.output.textContent = path.toString()
    this.svgPath.fill('none')
    this.svgPath.stroke({
      color: '#9b4dca',
      width: 1,
      linecap: 'round',
      linejoin: 'round',
    })
  }
  private attachAncors(path: SVG.PathArray) {
    path.value.map(point => this.drawPoint(point as any, path))
  }
  private drawPoint(point: any[], path: SVG.PathArray) {
    if (point.length === 3) {
      const circle = this.svgDoc.circle(6).move(point[1] - 3, point[2] - 3)
      ;(<any>circle).draggable()
      circle.on('dragmove', event => {
        point[1] = event.target.cx.baseVal.valueInSpecifiedUnits
        point[2] = event.target.cy.baseVal.valueInSpecifiedUnits
        this.drawPath(path)
      })
    }
  }

  private getRawValue(): SVGData {
    return {
      pathInput: this.html.pathInput.value,
      scale: parseInt(this.html.scale.value),
      transX: parseInt(this.html.transX.value),
      transY: parseInt(this.html.transY.value),
      rotate: parseInt(this.html.rotate.value),
    }
  }
}
