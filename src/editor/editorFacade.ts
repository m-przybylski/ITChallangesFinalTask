import { SVGData } from './interfaces'
import { Path } from './path'

export class EditorFacade {
  static getTransformatedPath(input: SVGData) {
    //1. parse
    //2. scale
    //3. moveX
    //4. moveY
    //5. rotate
    //6. print
    const path = new Path(input.pathInput)
      .scalePath(input.scale)
      .translateX(input.transX)
      .translateY(input.transY)
      .rotate(input.rotate)
    return path.getPathArray()
  }
}
