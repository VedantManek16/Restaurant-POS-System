import { configureStore } from '@reduxjs/toolkit'
import customerReducer from './slices/customerSlice'
import cartReducer from './slices/cartSlice'

const store = configureStore({
    reducer: {
        customer: customerReducer,
        cart: cartReducer,
    },
    devTools: import.meta.env.DEV
})

export default store;