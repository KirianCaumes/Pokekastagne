import { configureStore } from "@reduxjs/toolkit"
import { commonMiddleware, commonReducer } from "redux/slices/common"
import { userMiddleware, userReducer } from "redux/slices/user"

/**
 * @see https://www.valentinog.com/blog/redux/#modern-redux-with-redux-toolkit
 */
const store = configureStore({
    reducer: {
        user: userReducer,
        common: commonReducer
    },
    middleware: {
        ...userMiddleware,
        ...commonMiddleware
    },
})

export default store