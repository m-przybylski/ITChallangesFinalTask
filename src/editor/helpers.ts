import * as SVG from 'svg.js'

export interface ValidatorResult {
  valid: boolean
  error?: string
}
const missingM = 'missing M in the begining'

export class Helper {
  static rotate(input: SVG.PathArray, rotate: number): SVG.PathArray {
    const path = new SVG.Path()
    path.plot(input)
    const matrix = path.rotate(rotate).transform().matrix
    input.value.forEach((element: any) => {
      if (element.length === 3) {
        let point: any = new SVG.Point([element[1], element[2]])
        point = point.transform(matrix)
        element[1] = point.x
        element[2] = point.y
      }
    })
    return input
  }
  static validateInput(input: string): ValidatorResult {
    if (input[0] !== 'M' && input[0] !== 'm') {
      return this.reportError(missingM)
    }
    const regex = /(M|m|L|l|Z|z|H|h|V|v)/
    let result = []
    let splitedString = input.split(regex)
    if (splitedString[0] === '') {
      splitedString.shift()
    }
    if (splitedString[splitedString.length - 1] === '') {
      splitedString.pop()
    }
    try {
      splitedString.forEach(element => {
        if (element.length !== 1) {
          const points = element.trim().split(' ')
          if (points.length % 2 === 1) {
            throw new Error('Invalid params length')
          }
          const pointsInt = points.map(point => parseInt(point))
          pointsInt.forEach(point => {
            if (typeof point !== 'number' || isNaN(point)) {
              throw new Error('Not a number')
            }
          })
        }
      })
    } catch (error) {
      return this.reportError(error.message)
    }
    return this.reportSuccess()
  }
  static parsePath(input: string): any[] {
    const regex = /(M|m|L|l|Z|z)/
    let result = []
    let splitedString = input.split(regex)
    if (splitedString[0] === '') {
      splitedString.shift()
    }
    if (splitedString[splitedString.length - 1] === '') {
      splitedString.pop()
    }
    splitedString.forEach(element => {
      if (element.length === 1) {
        result.push(element.trim())
      } else {
        const points = element.split(' ').map(point => parseInt(point.trim()))
        if (points.length % 2 === 1) {
          throw new Error('Invalid params length')
        }
        points.forEach(point => {
          if (typeof point !== 'number' || isNaN(point)) {
            throw new Error('Not a number')
          }
        })
        const pointsArray = []
        for (var i = 0; i < points.length; i = i + 2) {
          pointsArray.push([points[i], points[i + 1]])
        }
        result.push(pointsArray)
      }
    })
    return result
  }
  static buildPath(input: any[]): string {
    const result = input.reduce((acc, curr) => {
      return acc + curr.toString()
    }, '')
    return result.replace(/,/g, ' ')
  }
  static scale(input: SVG.PathArray, scaleFactor: number) {
    input[1][0] = input[1][0].map(cord => cord * scaleFactor)
    input[3] = input[3].map(cord => cord.map(point => point * scaleFactor))
    return input
  }
  static scalePath(input: SVG.PathArray, scaleFactor: number) {
    input.value.forEach(element => {
      if (typeof element[1] !== 'undefined') {
        element[1] = element[1] * scaleFactor
      }
      if (typeof element[2] !== 'undefined') {
        element[2] = element[2] * scaleFactor
      }
    })
    return input
  }
  static translateX(input: any[], translateXFactor: number): any[] {
    input[1][0][0] = input[1][0][0] + translateXFactor
    input[3] = input[3].map(cord => [
      (cord[0] = cord[0] + translateXFactor),
      cord[1],
    ])
    return input
  }
  static translateXPath(
    input: SVG.PathArray,
    translateXFactor: number,
  ): SVG.PathArray {
    input.value.forEach(element => {
      if (typeof element[1] !== 'undefined') {
        element[1] = element[1] + translateXFactor
      }
    })
    return input
  }
  static translateY(input: any[], translateYFactor: number): any[] {
    input[1][0][1] = input[1][0][1] + translateYFactor
    input[3] = input[3].map(cord => [
      cord[0],
      (cord[1] = cord[1] + translateYFactor),
    ])
    return input
  }
  static translateYPath(
    input: SVG.PathArray,
    translateYFactor: number,
  ): SVG.PathArray {
    input.value.forEach(element => {
      if (typeof element[2] !== 'undefined') {
        element[2] = element[2] + translateYFactor
      }
    })
    return input
  }
  private static reportError(message: string): ValidatorResult {
    return {
      valid: false,
      error: message,
    }
  }
  private static reportSuccess(): ValidatorResult {
    return {
      valid: true,
    }
  }
}
