const UPDATEM = 'UPDATEM'
const UPDATEL = 'UPDATEL'
const SETPICK = 'SETPICK'
const SETQUANTB = 'SETQUANTB'
const CLREARF = 'CLREARF'
const SETBLANK = 'SETBLANK'
const SETEND = 'SETEND'
const SETQF = 'SETQF'
const WOW = 'WOW'
const WIN = 'WIN'
const SETTIME = 'SETTIME'
const RESET = 'RESET'

const InintState = {
    list : Array(16).fill().map(() => Array(16).fill(0)),
    mask : Array(16).fill().map(() => Array(16).fill(0)),
    isClick : true,
    isFirstPick : true,
    flags : 40,
    WOW : false,
    win : false,
    reset : true,
    time : 0
}

const reducer = (state = InintState, action) => {
    switch (action.type) {
        case UPDATEL:
            let lastSym = state.list[action.i][action.j]
            state.list[action.i][action.j] = action.sym
            return ({list : [...state.list], isLoose : lastSym === '*' ? true : false, mask : state.mask, isClick : state.isClick, flags : state.flags, WOW : false, win : state.win,time : state.time, reset : state.reset})
        case UPDATEM:
            if (action.sym === null){
                state.mask[action.i][action.j] = state.list[action.i][action.j] !== 0 ? state.list[action.i][action.j] : ''
            }
            else{
                state.mask[action.i][action.j] = action.sym
            }
            return({list : state.list, mask : [...state.mask], isClick : state.isClick, flags : state.flags, WOW : false, win : state.win,time : state.time, reset : state.reset})
        case SETPICK: 
            return({...state, isFirstPick : false, isClick : state.isClick, flags : state.flags,time : 1, reset : false})
        case SETQUANTB:
            for (let i = action.it; i <= action.ib; i++){
                for (let j = action.jt; j <= action.jb; j++){
                    if (state.list[i][j] !== '*'){
                        state.list[i][j] += 1
                    }
                }
            }
            return ({list : [...state.list], mask : state.mask, isClick : state.isClick, flags : state.flags,WOW : false, win : state.win, time : state.time, reset : state.reset})
        case SETBLANK:
            for (let i = action.it; i <= action.ib; i++){
                for (let j = action.jt; j <= action.jb; j++){
                    if (state.list[i][j] !== '*'){
                        state.mask[i][j] = state.list[i][j] !== 0 ? state.list[i][j] : '' 
                    }
                }
            }
            return ({list : state.list, mask : [...state.mask], isClick : state.isClick, flags : state.flags,WOW : false, win : state.win, time : state.time, reset : state.reset})
        case CLREARF:
            return({list : Array(16).fill().map(() => Array(16).fill(0)),mask : Array(16).fill().map(() => Array(16).fill(0)), isFirstPick : true, isClick : true,flags : 40, WOW : false, win : false, time : 1, reset : false})
        case SETEND:
            return({...state, isClick : false, WOW : false,time : state.time, reset : true})
        case SETQF:
            return ({...state, flags : action.q})
        case WOW:
            return ({...state, WOW : true})
        case WIN:
            return({...state, win : true})
        case SETTIME:
            return ({...state, time : action.time})
        case RESET:
            return ({...state, reset : action.reset})
        default : 
            return state
    }
}

export const UpdateList = (i,j, sym) => ({type : 'UPDATEL', i, j, sym})
export const UpdateMask = (i,j,sym = null) => ({type : 'UPDATEM', i, j, sym})
export const SetPick = () => ({type : 'SETPICK'})
export const SetQuantBombs = (ib, jb, it, jt) => ({type : 'SETQUANTB', it, jt, ib, jb})
export const ClearField = () => ({type : 'CLREARF'})
export const SetBlank = (ib, jb, it, jt) => ({type : 'SETBLANK', it, jt, ib, jb})
export const SetEnd = () => ({type : 'SETEND'})
export const SetQuantFlag = (q) => ({type : 'SETQF', q})
export const SetWOW = () => ({type : 'WOW' })
export const winGame = () => ({type : 'WIN'})
export const Settime = (time) => ({type : 'SETTIME', time})
export const SetReset = (reset) => ({type : 'RESET',reset})

export default reducer