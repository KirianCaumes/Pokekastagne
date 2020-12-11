import { configureStore } from "@reduxjs/toolkit"
import { commonMiddleware, commonReducer } from "redux/slices/common"

/**
 * @see https://www.valentinog.com/blog/redux/#modern-redux-with-redux-toolkit
 */
const store = configureStore({
    reducer: {
        common: commonReducer
    },
    middleware: {
        ...commonMiddleware
    },
})

export default store