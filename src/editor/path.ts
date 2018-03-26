import { Helper } from './helpers'
import * as SVG from 'svg.js'

interface PathArray {}

export class Path {
  private path: SVG.PathArray
  constructor(input: string) {
    const path = new SVG.Path()
    path.plot(input)
    this.path = path.array()
  }
  public scalePath(scaleFactory: number): Path {
    this.path = Helper.scalePath(this.path, scaleFactory)
    return this
  }
  public translateX(transX: number): Path {
    this.path = Helper.translateXPath(this.path, transX)
    return this
  }
  public translateY(transY: number): Path {
    this.path = Helper.translateYPath(this.path, transY)
    return this
  }
  public getPathArray(): SVG.PathArray {
    return this.path
  }
  public rotate(rotate: number): Path {
    this.path = Helper.rotate(this.path, rotate)
    return this
  }
}
