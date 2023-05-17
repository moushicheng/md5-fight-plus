import { SyncBailHook } from "../SyncBailHook";
import _ from 'lodash'
type HooksType = {
    player1: string,
    player2: string
}

const hook = new SyncBailHook<HooksType | number>({
    intercept: (params) => {
        if (_.isNumber(params)) {
            return params;
        }
        params.player1 += ' @inter'
        params.player2 += ' @inter'
        return params
    }
})

hook.tap('@func1', (props) => {
    console.log('@f1', props);
    return props
})
hook.tap('@func2', (props) => {
    console.log('@f2', props);
    return 233
})
hook.tap('@err_fun', (props) => {
    (props as HooksType).player1 = '1'
    return 333
})

const result = hook.call({
    player1: '1',
    player2: '2'
})
console.log('@result:', result);