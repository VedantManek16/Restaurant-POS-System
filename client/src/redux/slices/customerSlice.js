import { createSlice } from '@reduxjs/toolkit'

const generateOrderId = () => {
    const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, ''); // YYMMDD
    const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `#ORD-${dateStr}-${randomStr}`;
};

const initialState = {
    orderId: generateOrderId(),
    customerName: 'Walk-in Customer',
    customerMobileNumber: '',
    guests: 1,
    tableNumber: 'Takeaway',
    tableId: null,
    activeOrderId: null
}
 
export const customerSlice = createSlice({
    name: 'customer',
    initialState,
    reducers: {
        setCustomerDetails: {
            reducer: (state, action) => {
                const { name, phone, guests, orderId } = action.payload;
                state.customerName = name || 'Walk-in Customer';
                state.orderId = orderId;
                state.customerMobileNumber = phone || '';
                state.guests = guests || 1;
                state.activeOrderId = null;
            },
            prepare: ({ name, phone, guests }) => {
                return {
                    payload: {
                        name,
                        phone,
                        guests,
                        orderId: generateOrderId(),
                    }
                };
            }
        },
        removeCustomerDetails: {
            reducer: (state, action) => {
                state.customerName = 'Walk-in Customer';
                state.orderId = action.payload.orderId;
                state.customerMobileNumber = '';
                state.guests = 1;
                state.tableNumber = 'Takeaway';
                state.tableId = null;
                state.activeOrderId = null;
            },
            prepare: () => {
                return {
                    payload: {
                        orderId: generateOrderId(),
                    }
                };
            }
        },
        updateTable: (state, action) => {
            state.tableNumber = action.payload.tableNumber;
            state.tableId = action.payload.tableId;
            if (action.payload.activeOrderId !== undefined) {
                state.activeOrderId = action.payload.activeOrderId;
            }
            if (action.payload.customerName) {
                state.customerName = action.payload.customerName;
            }
            if (action.payload.customerMobileNumber) {
                state.customerMobileNumber = action.payload.customerMobileNumber;
            }
            if (action.payload.guests) {
                state.guests = action.payload.guests;
            }
            if (action.payload.orderId) {
                state.orderId = action.payload.orderId;
            }
        },
    },
})

// Action creators are generated for each case reducer function
export const { setCustomerDetails, removeCustomerDetails, updateTable } = customerSlice.actions

export default customerSlice.reducer