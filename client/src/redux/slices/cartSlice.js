import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    cartItems: [], // Each item: { id, menuId, name, price, category, quantity, notes }
    sessionItems: [], // Placed items in the current dining session: { id, name, price, quantity, status }
};

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem: (state, action) => {
            const { item, menuId } = action.payload;
            const existingItem = state.cartItems.find(
                (cartItem) => cartItem.id === item.id && cartItem.menuId === menuId
            );
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.cartItems.push({
                    ...item,
                    menuId,
                    quantity: 1,
                    notes: '',
                });
            }
        },
        removeItem: (state, action) => {
            const { itemId, menuId } = action.payload;
            const existingItemIndex = state.cartItems.findIndex(
                (cartItem) => cartItem.id === itemId && cartItem.menuId === menuId
            );
            if (existingItemIndex !== -1) {
                const existingItem = state.cartItems[existingItemIndex];
                if (existingItem.quantity > 1) {
                    existingItem.quantity -= 1;
                } else {
                    state.cartItems.splice(existingItemIndex, 1);
                }
            }
        },
        removeItemFromCart: (state, action) => {
            const { itemId, menuId } = action.payload;
            state.cartItems = state.cartItems.filter(
                (cartItem) => !(cartItem.id === itemId && cartItem.menuId === menuId)
            );
        },
        updateItemNote: (state, action) => {
            const { itemId, menuId, notes } = action.payload;
            const existingItem = state.cartItems.find(
                (cartItem) => cartItem.id === itemId && cartItem.menuId === menuId
            );
            if (existingItem) {
                existingItem.notes = notes;
            }
        },
        clearCart: (state) => {
            state.cartItems = [];
        },
        loadCart: (state, action) => {
            state.cartItems = action.payload || [];
        },
        loadSessionItems: (state, action) => {
            state.sessionItems = action.payload || [];
        },
        clearSessionItems: (state) => {
            state.sessionItems = [];
        },
    },
});

export const {
    addItem,
    removeItem,
    removeItemFromCart,
    updateItemNote,
    clearCart,
    loadCart,
    loadSessionItems,
    clearSessionItems,
} = cartSlice.actions;

export default cartSlice.reducer;
