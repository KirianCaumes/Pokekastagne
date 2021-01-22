import {
    getDefaultMiddleware,
    createSlice,
} from "@reduxjs/toolkit"
import { Middleware } from "redux" // eslint-disable-line
import { Slice, PayloadAction } from "@reduxjs/toolkit" // eslint-disable-line
import { User } from "request/objects/user"

/**
 * User middlewares, must have "getDefaultMiddleware"
 * @type {Middleware[]}
 */
const userMiddleware = [
    ...getDefaultMiddleware()
]

/**
 * Payload Init
 * @typedef {object} PayloadInit
 * @property {User} me User data 
 * 
 * Payload SingIn
 * @typedef {object} PayloadSingIn Token
 * @property {string} token Token
 */

/**
 * User State
 * @typedef {object} UserState
 * @property {boolean} isAuthenticated Is user authenticated
 * @property {User} me User informations
*/

/**
 * User Slice
 * @type {Slice<UserState>}
 */
const userSlice = createSlice({
    name: "user",
    /** @type {UserState} */
    initialState: {
        isAuthenticated: !!localStorage.getItem(process.env.REACT_APP_LOCAL_STORAGE_KEY),
        me: new User()
    },
    reducers: {
        /**
         * Sign in
         * @param {PayloadAction<PayloadSingIn>} action
         */
        signIn: (state, action) => {
            localStorage.setItem(process.env.REACT_APP_LOCAL_STORAGE_KEY, action.payload?.token)
            state.isAuthenticated = true
        },
        /**
         * Sign out
         * @param {PayloadAction} action
         */
        signOut: (state) => {
            console.log("signout")
            localStorage.removeItem(process.env.REACT_APP_LOCAL_STORAGE_KEY)
            state.isAuthenticated = false
        },
        /**
         * Init
         * @param {PayloadAction<PayloadInit>} action
         */
        init: (state, action) => {
            state.me = action.payload?.me
        }
    },
})

const { init, signIn, signOut } = userSlice.actions
const userReducer = userSlice.reducer

export {
    init, signIn, signOut, //Reducers, used to call actions
    userReducer, //All reducers, used to create store
    userMiddleware //Middleware
}