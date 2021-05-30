import { createStore, applyMiddleware, combineReducers } from 'redux';
import { authReducer, promiseReducer, playerReducer } from "./reducers/index";
import thunk from 'redux-thunk';


let store = createStore(combineReducers({
    promise: promiseReducer,
    auth: authReducer,
    player:  playerReducer,
}), applyMiddleware(thunk))


store.subscribe(()=> console.log(store.getState()))
export { store };