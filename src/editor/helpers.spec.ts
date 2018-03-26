import { Helper } from './helpers'
describe('helpers', () => {
  describe('validateInput', () => {
    let input
    it('should return fail for invalid input no M', () => {
      input = 'L10 10 L 15 15 Z'
      expect(Helper.validateInput(input)).toEqual({
        valid: false,
        error: 'missing M in the begining',
      })
    })
    it('should return sukccess when first char in M', () => {
      input = 'M10 10 L 15 15Z'
      expect(Helper.validateInput(input)).toEqual({ valid: true })
    })
    it('should return sukccess when first char in m', () => {
      input = 'm10 10 L 15 15Z'
      expect(Helper.validateInput(input)).toEqual({ valid: true })
    })
    it('should return fail for invalid character', () => {
      input = 'M10 10 L 15 15 10 aZ'
      expect(Helper.validateInput(input)).toEqual({
        valid: false,
        error: 'Not a number',
      })
    })
    it('should return fail for invalid point length', () => {
      input = 'M10 10 L 15 15 10Z'
      expect(Helper.validateInput(input)).toEqual({
        valid: false,
        error: 'Invalid params length',
      })
    })
  })
  describe('parsePath', () => {
    let input
    it('should get starting point', () => {
      input = 'M10 10'
      const value = Helper.parsePath(input)
      expect(value).toEqual(['M', [[10, 10]]])
    })
    it('should get starting point and some lines', () => {
      input = 'M10 10L10 10 10 10'
      const value = Helper.parsePath(input)
      expect(value).toEqual(['M', [[10, 10]], 'L', [[10, 10], [10, 10]]])
    })
    it('should get starting point and some lines and Z', () => {
      input = 'M10 10L10 10 10 10Z'
      const value = Helper.parsePath(input)
      expect(value).toEqual(['M', [[10, 10]], 'L', [[10, 10], [10, 10]], 'Z'])
    })
    it('should maybe throw??', () => {
      input = 'M10 10L10 1.56 sdf 10 10 10Z'
      expect(() => Helper.parsePath(input)).toThrowError('Not a number')
    })

    it('should maybe throw??', () => {
      input = 'M10 10L10 1 13 13 10Z'
      expect(() => Helper.parsePath(input)).toThrowError(
        'Invalid params length',
      )
    })
  })
  describe('buildPath', () => {
    let input
    it('should build path from input', () => {
      input = ['M', [[10, 10]], 'L', [[10, 10], [10, 10]], 'Z']
      expect(Helper.buildPath(input)).toEqual('M10 10L10 10 10 10Z')
    })
    it('should build path from input', () => {
      input = ['M', [[10, 10]], 'L', [[10, 10]], 'Z']
      expect(Helper.buildPath(input)).toEqual('M10 10L10 10Z')
    })
  })

  describe('scale', () => {
    let scaleFactor, input
    it('should multiply all by 2', () => {
      ;(scaleFactor = 2),
        (input = ['M', [[10, 10]], 'L', [[10, 10], [5, 30]], 'Z'])
      const result = Helper.scale(input, scaleFactor)
      expect(result).toEqual(['M', [[20, 20]], 'L', [[20, 20], [10, 60]], 'Z'])
    })

    it('should multiply all by 3', () => {
      ;(scaleFactor = 3),
        (input = ['M', [[10, 10]], 'L', [[10, 10], [5, 30]], 'Z'])
      const result = Helper.scale(input, scaleFactor)
      expect(result).toEqual(['M', [[30, 30]], 'L', [[30, 30], [15, 90]], 'Z'])
    })
  })

  describe('translateX', () => {
    let factor
    it('should move element to right when positive', () => {
      factor = 10
      const input = ['M', [[10, 10]], 'L', [[10, 10], [5, 30]], 'Z']
      const result = Helper.translateX(input, factor)
      expect(result).toEqual(['M', [[20, 10]], 'L', [[20, 10], [15, 30]], 'Z'])
    })
  })
  describe('translateY', () => {
    let factor
    it('should move element to right when positive', () => {
      factor = 10
      const input = ['M', [[10, 10]], 'L', [[10, 10], [5, 30]], 'Z']
      const result = Helper.translateY(input, factor)
      expect(result).toEqual(['M', [[10, 20]], 'L', [[10, 20], [5, 40]], 'Z'])
    })
  })
})
