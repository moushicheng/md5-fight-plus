import { BailEvent } from "@/events/BailEvent";
import _ from "lodash";
type TapOptions = {
  name?: string;
  lives?: number; //生命次数，若<=0，则会自动移除tap,若lives不存在则视为无限执行次数的tap
  stage?: number; //优先级，越小优先级越高 范围0~99
};
type SyncBailHookOptions<T> = {
  beforeAction?: (params?: T) => any;
  afterAction?: (params?: T) => any;
};
type LastCallback = (params: any) => any;
export let ids = -1;
export let hooksRecord = [];
export class SyncBailHook<T> {
  bailedResult: any;
  cbs: { options: TapOptions; func: (params: T) => any; id: number }[];
  options: SyncBailHookOptions<T>;
  error: any;
  afterActionHook: SyncBailHook<T>;
  beforeActionHook: SyncBailHook<T>;
  lastCallback: LastCallback;
  constructor(options: SyncBailHookOptions<T> = {}) {
    this.bailedResult = undefined;
    this.cbs = [];
    this.options = options;
    this.error = undefined;
    this.lastCallback = (params) => params;
    if (this.options.afterAction) {
      this.registerAfterActionHook(
        "register options afterAction",
        this.options.afterAction
      );
    }
    if (this.options.beforeAction) {
      this.registerBeforeActionHook(
        "register options beforeAction",
        this.options.beforeAction
      );
    }
  }
  tap(options: string | TapOptions, callback: (params: T) => T | BailEvent) {
    const optionsFormatted = formatTapOptions(options);
    this.cbs.push({
      options: optionsFormatted,
      func: callback,
      id: ids++,
    });
    this.cbs.sort((cb1, cb2) => cb1.options.stage - cb2.options.stage);
    return ids - 1;
  }
  call(params?: T) {
    this.bailedResult = params;
    try {
      for (let i = 0; i < this.cbs.length; i++) {
        const currentTap = this.cbs[i];
        if (this.beforeActionHook) {
          this.bailedResult = this.beforeActionHook.call(this.bailedResult);
          //如果返回值是BailEvent,则会直接熔断。
          if (this.bailedResult instanceof BailEvent) break;
        }

        this.bailedResult = currentTap.func(this.bailedResult);

        if (
          _.isNumber(currentTap.options.lives) &&
          --currentTap.options.lives <= 0
        ) {
          //减少生命计数,若计数值<0则移除taps
          this.removeTap(currentTap.id);
          i--;
        }
        hooksRecord.push(currentTap.options.name);
        //如果返回值是BailEvent,则会直接熔断。
        if (this.bailedResult instanceof BailEvent) break;

        //拦截器
        if (this.afterActionHook) {
          this.bailedResult = this.afterActionHook.call(this.bailedResult);
          //如果返回值是BailEvent,则会直接熔断。
          if (this.bailedResult instanceof BailEvent) break;
        }
      }
    } catch (err) {
      this.error = err;
    } finally {
      if (this.error) throw this.error;
      return this.lastCallback(this.bailedResult);
    }
  }
  registerLastCallback(cb: LastCallback) {
    this.lastCallback = cb;
  }
  registerAfterActionHook(
    info: string = "register afterActionFn",
    cb: (params?: T) => any
  ) {
    if (!this.afterActionHook) {
      this.afterActionHook = new SyncBailHook<T | undefined>();
    }
    this.afterActionHook.tap(info, (params) => cb(params));
  }
  registerBeforeActionHook(
    info: string = "register afterActionFn",
    cb: (params?: T) => any
  ) {
    if (!this.beforeActionHook) {
      this.beforeActionHook = new SyncBailHook<T | undefined>();
    }
    this.beforeActionHook.tap(info, (params) => cb(params));
  }
  removeTap(id) {
    for (let i = 0; i < this.cbs.length; i++) {
      const cb = this.cbs[i];
      if (cb.id === id) {
        return this.cbs.splice(i, 1);
      }
    }
    return false;
  }
}
function formatTapOptions(options: string | TapOptions) {
  const rawOptions: TapOptions = {
    name: "",
    stage: 50,
  };
  if (_.isString(options)) {
    rawOptions.name = options;
    return rawOptions;
  }
  for (const key in options) {
    rawOptions[key] = options[key];
  }
  return rawOptions;
}
