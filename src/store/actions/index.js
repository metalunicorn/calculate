import gql from "../gql"
import React, { useState, useEffect, useRef } from "react";

const actionAuthLogin = jwt => ({ type: 'LOGIN', jwt })
const actionAuthLogout = () => ({ type: 'LOGOUT' })

export const actionPromise = (name, promise) => {
    const actionPending = () => ({ type: 'PROMISE', name, status: 'PENDING', payload: null, error: null })
    const actionResolved = payload => ({ type: 'PROMISE', name, status: 'RESOLVED', payload, error: null })
    const actionRejected = error => ({ type: 'PROMISE', name, status: 'REJECTED', payload: null, error })


    return async dispatch => {
        dispatch(actionPending())
        let payload
        try {
            payload = await promise
            dispatch(actionResolved(payload))
        }
        catch (e) {
            dispatch(actionRejected(e))
        }
        return payload;
    }
}

const actionLogin = (login, password) =>
    async dispatch => {
        let loginData = await dispatch(actionPromise('login', gql(
            `query login($login:String!, $password:String!){
              login(login:$login,password:$password)
            }`, { login, password })))
        if (loginData && loginData.data.login) {
            dispatch(actionAuthLogin(loginData.data.login))
            window.location.reload();
        }
    }

const actionReg = (login, password) =>
    async dispatch => {
        let loginData = await dispatch(actionPromise('reg', gql(
            `mutation reg($login: String!, $password: String!){
                createUser(login:$login, password: $password){
                  _id
                }
              }`, { login, password })))
        if (loginData && loginData.data && (loginData.data.createUser != null)) {
            dispatch(actionLogin(login, password))
            console.log(loginData.data)
        }
    }

const actionPlaylist = (id) =>
    async dispatch => {
        let PlaylistData = await dispatch(actionPromise('playlist', gql(
            `query playlist( $id:String){
                PlaylistFindOne(query: $id) {
                name
                owner {
                  nick
                }
                description
                tracks {
                  originalFileName
                  url
                  id3 {
                    title
                     artist
                     album
                    }
                }
              }
            }`, { id: JSON.stringify([{ _id: id, tracks: { $ne: null }}]) })))
            console.log(PlaylistData)
            // const audioRef = useRef(new Audio(`http://player.asmer.fs.a-level.com.ua/${url}`));
            // actionPlayerData()
    }

const toRegexp2 = queryString => `/${queryString.split([" "]).join(['|']).trim()}/`
const toQuery = (queryString, fields = ["id3.artist", "id3.title", "id3.album"]) => ({ $or: fields.map(x => ({ [x]: toRegexp2(queryString) })) })

const actionSearch = (queryString) =>
    async dispatch => {
        let searchData = await dispatch(actionPromise('search', gql(
            `query trackFind($query: String) {
            TrackFind(query:$query)
              {
                  originalFileName
                  url
                  id3 {
                          title
                          artist
                          album
                      }
              }
          }`, {
            query: JSON.stringify([toQuery(queryString),
            {
                sort: [{ _id: -1 }], //сортировка в обратном хронологическом порядке
                limit: [10],  //100 записей максимум
            }])
        }
        )))
        console.log(searchData)
    }

const actionSendTrack = (trackFile,idPlaylist) =>
    async dispatch => {
        const formData = new FormData();
        formData.set("track", trackFile);
        let sendData = await dispatch(actionPromise('send', fetch(`http://player.asmer.fs.a-level.com.ua/track`,
            {
                method: 'POST',
                headers: localStorage.authToken ? { Authorization: 'Bearer ' + localStorage.authToken } : {},
                body: formData
            })))
        let responce = await dispatch(actionPromise('sendData', sendData.json()))
        console.log(idPlaylist)
        let AddTrack = dispatch(actionAddToMyPlayList(responce._id,idPlaylist))
        console.log(AddTrack)
    }

const actionPlaylists = (skip=0) =>
    async dispatch => {
        let PlaylistsData = await dispatch(actionPromise('playlists', gql(
            `query playlists( $id:String){
                PlaylistFind(query: $id) {
                _id
                name
              }
            }`, {
            id: JSON.stringify([{ tracks: { $nin: [null,[]] }, name:{ $ne: null}}, {
                sort: [{ _id: -1 }], //сортировка в обратном хронологическом порядке
                limit: [10],  //100 записей максимум
                skip: [skip],
            }])
        })))
        console.log(PlaylistsData)
    }

const actionMyPlaylist = (id) =>
    async dispatch => {
        console.log(id)
        let MyPlaylist = await dispatch(actionPromise('myPlaylist', gql(
            `query playlist($owner:String) {
                PlaylistFind(query: $owner) {
                _id
                name
                owner {
                        _id
                        login
                    }
                tracks {
                    _id
                    originalFileName
                    url
                    id3{
                        title
                          artist
                          album
                    }
                }
              }
            }`, { owner: JSON.stringify([{ ___owner: id, tracks: { $ne: null },name:{ $ne: null}}]) })))
        console.log(MyPlaylist)
    }

const actionAddToMyPlayList = (idTrack,idPlaylist) =>
    async dispatch => {
        let AddToMyPlaylist = await dispatch(actionPromise('addMyPlaylist', gql(
            `mutation addTrack($idTrack:ID, $idPlaylist:ID) {
                TrackUpsert(track:{_id: $idTrack playlists: {_id: $idPlaylist }})
              {
                _id
                }
            }`, { idTrack,idPlaylist })))
        console.log(AddToMyPlaylist)
    }


const actionAddToMyPlaylistArray = (id="60465c10bb419837a862df0b") =>
async dispatch => {
    let AddToMyPlaylist = await dispatch(actionPromise('addMyPlaylist', gql(
        `mutation addPlaylist {
            PlaylistUpsert(playlist:{_id: "60465c10bb419837a862df0b"}){
                _id,name,tracks{
                        _id
                        }
            }
        
        }`, { id })))
    console.log(AddToMyPlaylist)
}

export  const actionAddPlayList = (namePlaylist) =>
    async dispatch => {
        let AddPlaylist = await dispatch(actionPromise('addPlaylist', gql(
            `mutation addPlaylist($addPlaylist: PlaylistInput) {
                PlaylistUpsert(playlist: $addPlaylist){
                    _id,name,tracks{
                            _id
                            }
                }
            
            }`, { addPlaylist : {
                "name": namePlaylist,
                "tracks": []
              } })))
        console.log(AddPlaylist)
    }



const actionPlay = () => ({ type: 'PLAY'})
export const actionPause = () => ({type: 'PAUSE'})
export const actionPlayOne = (playing,title) => ({type: 'PLAYONE',playing,title})
export const actionPlayerData = (playing,playlist=[]) => {
return({type: 'PLAYERDATA',playing,playlist})
}
export const actionNextTrack = () => ({type: 'NEXTTRACK'})
export const actionPrevTrack = () => ({type: 'PREVTRACK'})
export const actionClearPlayer = () => ({type: 'CLEAR'})


export { actionLogin, actionAuthLogin, actionAuthLogout, actionPlaylist, actionReg, actionPlaylists, actionSendTrack, actionSearch, actionPlay, actionMyPlaylist, actionAddToMyPlayList };