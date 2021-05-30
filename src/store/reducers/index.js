import { duration } from "@material-ui/core";
import jwt_decode from "jwt-decode";

function authReducer(state, action) { //....

    if (state === undefined) {
        //добавить в action token из localStorage, и проимитировать LOGIN (action.type = 'LOGIN')
        if (localStorage.authToken) {
            action.type = 'LOGIN'
        }
        else {
            //console.log(localStorage.authToken)
            return {}

        }
    }
    if (action.type === 'LOGIN') {

        //console.log('ЛОГИН')
        if (action.jwt) {
            localStorage.authToken = action.jwt
            return { token: action.jwt, payload: jwt_decode(action.jwt), login: true }
        }
        return { token: localStorage.authToken, payload: jwt_decode(localStorage.authToken), login: true }
    }
    if (action.type === 'LOGOUT') {
        
        localStorage.removeItem('authToken')
        //вернуть пустой объект
        return {}
    }
    return state
}

function promiseReducer(state = {}, action) {
    if (['LOGOUT', 'LOGIN'].includes(action.type)) return {}
    if (action.type === 'PROMISE') {
        const { name = "default", status, payload, error } = action
        if (status) {
            return {
                ...state, [name]: { status, payload: (status === 'PENDING' && state[name] && state[name].payload) || payload, error }
            }
        }
    }
    return state;
}

function playerReducer (state, action) {
    if(state === undefined){
      const audio =   new Audio()
      audio.type ="audio/mpeg"
      return {
          ...state,audio: audio
      }
    }
    if(action.type === 'PLAY')
    {   
        state.audio.play()
        console.log("play")
        setTimeout(()=>state.audio.duration,200);
        return {
            ...state,play: action.play = true,duration: state.audio.duration
        }
    }
    if(action.type === 'PAUSE')
    {   
        state.audio.pause()
        console.log("pause")
        return {
            ...state,play: action.play=false,
        }
    }
    if(action.type === 'PLAYERDATA')
    {   
        state.playing = `http://player.asmer.fs.a-level.com.ua/${action.playing}`
        state.audio.src = state.playing
        action.type = 'PLAY'
        return {
            ...state,
            playing : action.playing,
            playlist: action.playlist,
            duration:state.audio.duration,
            numberTrack: 0
        }
    }
    if(action.type === 'PLAYONE'){
        state.playing = `http://player.asmer.fs.a-level.com.ua/${action.playing}`
        state.audio.src = state.playing
        return {
            ...state,
            title: action.title,
            playing : action.playing,
            playlist: undefined,
        }
    }
    if(action.type === 'NEXTTRACK'){
        state.audio.currentTime = 0
        state.numberTrack = state.numberTrack+1
        if(state.playlist){
        if (state.numberTrack < state.playlist.length){
        state.playing = state.playlist[state.numberTrack].url
        state.audio.src = `http://player.asmer.fs.a-level.com.ua/${state.playing}`
        }
        else {
            state.numberTrack=0
            state.playing = state.playlist[state.numberTrack].url
            state.audio.src = `http://player.asmer.fs.a-level.com.ua/${state.playing}`
        }
        console.log(state.playing)
        }
         
        return {
            ...state,duration:state.audio.duration
        }
    }
    if(action.type === 'PREVTRACK'){
        state.audio.currentTime = 0
        console.log(state.playing)
        state.numberTrack = state.numberTrack-1
        if (state.numberTrack < 0){
        state.numberTrack=state.playlist.length-1
        state.playing = state.playlist[state.numberTrack].url
        state.audio.src = `http://player.asmer.fs.a-level.com.ua/${state.playing}`
        }
        else {
            state.playing = state.playlist[state.numberTrack].url
            state.audio.src = `http://player.asmer.fs.a-level.com.ua/${state.playing}`
        }
        console.log(state.playing)
        return {
            ...state,
        }
    }
    if(action.type === 'CLEAR'){
        state.audio.pause()
        return {}
    }
    return state
}
export { authReducer, promiseReducer,  playerReducer };