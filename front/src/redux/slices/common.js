import {
    getDefaultMiddleware,
    createSlice,
} from "@reduxjs/toolkit"

import { Middleware } from "redux" // eslint-disable-line
import { Slice, PayloadAction } from "@reduxjs/toolkit" // eslint-disable-line

/**
 * Common middlewares, must have "getDefaultMiddleware"
 * @type {Middleware[]}
 */
const commonMiddleware = [
    ...getDefaultMiddleware()
]

/**
 * Payload Test
 * @typedef {object} PayloadTest
 * @property {string} test test
 */

/**
 * Common State
 * @typedef {object} CommonState
 * @property {string} test Test
*/
/**
 * Common Slice
 * @type {Slice<CommonState>}
 */
const commonSlice = createSlice({
    name: "common",
    /** @type {CommonState} */
    initialState: {
        test: '',
    },
    reducers: {
        /**
         * Set test
         * @param {PayloadAction<PayloadTest>} action
         */
        setTest: (state, action) => {
            state.test = action.payload.test
        }
    },
})

const { setTest } = commonSlice.actions
const commonReducer = commonSlice.reducer

export {
    setTest, //Reducers, used to call actions
    commonReducer, //All reducers, used to create store
    commonMiddleware //Middleware
}