/**
 * 返回结果
 */
export class BackResult<T> {
  // region 属性
  private _code: number
  private _error: string
  private _data?: T
  private _detail?: string
  private _cb?: string
  // endregion

  // region getter/setter
  get code(): number {
    return this._code
  }

  set code(value: number) {
    this._code = value
  }

  get error(): string {
    return this._error
  }

  set error(value: string) {
    this._error = value
  }

  get data(): T | undefined {
    return this._data
  }

  set data(value: T | undefined) {
    this._data = value
  }

  get detail(): string | undefined {
    return this._detail
  }

  set detail(value: string | undefined) {
    this._detail = value
  }

  get cb(): string | undefined {
    return this._cb
  }

  set cb(value: string | undefined) {
    this._cb = value
  }
  // endregion

  constructor() {
    this._code = 0
    this._error = ''
  }
  static getInstance<T>(): BackResult<T> {
    return new BackResult<T>()
  }
  setErrorCode(errorCode: ErrorCode): BackResult<T> {
    this._code = errorCode.code
    this._error = errorCode.name
    return this
  }

  ok(data: T | undefined): BackResult<T> {
    this.setErrorCode(ErrorCodes.OK)
    this.data = data
    return this
  }
}

export interface ErrorCode {
  code: number
  name: string
}
export const ErrorCodes = {
  OK: { code: 200, name: 'OK' },
  BadRequest: { code: 400, name: 'BadRequest' },
  Unauthorized: { code: 401, name: 'Unauthorized' },
  Forbidden: { code: 403, name: 'Forbidden' },
  NotFound: { code: 404, name: 'NotFound' },
  InternalServerError: { code: 500, name: 'InternalServerError' },
  ServiceUnavailable: { code: 503, name: 'ServiceUnavailable' },
  TooManyRequests: { code: 429, name: 'TooManyRequests' }
}
