import { BailEvent } from '@/events/BailEvent'
import _ from 'lodash'
type TapOptions = {
    name?: string,
    stage?: number //优先级，越小优先级越高 范围0~99
}
type SyncBailHookOptions<T> = {
    intercept?: (params?: T) => any
}
type LastCallback = (params: any) => any
export let ids = -1
export class SyncBailHook<T>{
    bailedResult: any
    cbs: { options: TapOptions, func: (params: T) => any, id: number }[]
    options: SyncBailHookOptions<T>
    error: any
    interceptHook: SyncBailHook<T>
    lastCallback: LastCallback
    constructor(options: SyncBailHookOptions<T> = {}) {
        this.bailedResult = undefined
        this.cbs = []
        this.options = options
        this.error = undefined
        this.lastCallback = (params) => params
        if (this.options.intercept) {
            this.registerIntercept('register options intercept', this.options.intercept)
        }
    }
    tap(options: string | TapOptions, callback: (params: T) => T | BailEvent) {
        const optionsFormatted = formatTapOptions(options)
        this.cbs.push({
            options: optionsFormatted,
            func: callback,
            id: ids++
        })
        this.cbs.sort((cb1, cb2) => cb1.options.stage - cb2.options.stage)
        return ids - 1
    }
    call(params?: T) {
        this.bailedResult = params
        try {
            for (let i = 0; i < this.cbs.length; i++) {
                this.bailedResult = this.cbs[i].func(this.bailedResult)
                //如果返回值是BailEvent,则会直接熔断。
                if (this.bailedResult instanceof BailEvent) break;

                //拦截器
                if (this.interceptHook) {
                    this.bailedResult = this.interceptHook.call(this.bailedResult)
                    //如果返回值是BailEvent,则会直接熔断。
                    if (this.bailedResult instanceof BailEvent) break;
                }
            }
        } catch (err) {
            this.error = err;
        } finally {
            if (this.error) throw this.error
            return this.lastCallback(this.bailedResult)
        }
    }
    registerLastCallback(cb: LastCallback) {
        this.lastCallback = cb;
    }
    registerIntercept(info: string = 'register interceptFn', cb) {
        if (!this.interceptHook) {
            this.interceptHook = new SyncBailHook<T | undefined>()
        }
        this.interceptHook.tap(info, (params) => cb(params))
    }
    removeTap(id) {
        for (let i = 0; i < this.cbs.length; i++) {
            const cb = this.cbs[i]
            if (cb.id === id) {
                return this.cbs.splice(i, 1)
            }
        }
        return false
    }
}
function formatTapOptions(options: string | TapOptions) {
    const rawOptions: TapOptions = {
        name: '',
        stage: 50,
    }
    if (_.isString(options)) {
        rawOptions.name = options
        return rawOptions
    }
    for (const key in options) {
        rawOptions[key] = options[key]
    }
}