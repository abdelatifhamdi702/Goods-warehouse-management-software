import { createSlice } from '@reduxjs/toolkit'

export const CartSlice = createSlice({
  name: 'cart',
  initialState: {
    cart: [],
  },
  reducers: {
    addToCart: (state, action) => {
      const itemPresent = state.cart.find(
        (item) => item.code === action.payload.code
      )
      if (itemPresent) {
        itemPresent.qte++
      } else {
        state.cart.push({ ...action.payload, qte: 1, qteP: 0 })
      }
    },
    removeFromCart: (state, action) => {
      const removeItem = state.cart.filter(
        (item) => item.code !== action.payload.code
      )
      state.cart = removeItem
    },
    incrementQuantity: (state, action) => {
      const itemPresent = state.cart.find(
        (item) => item.code === action.payload.code
      )
      itemPresent.qte++
    },
    decrementQuantity: (state, action) => {
      const itemPresent = state.cart.find(
        (item) => item.code === action.payload.code
      )
      if (itemPresent.qte == 1) {
        itemPresent.qte = 0
        const removeItem = state.cart.filter(
          (item) => item.code !== action.payload.code
        )
        state.cart = removeItem
      } else {
        itemPresent.qte--
      }
    },
    addToCartP: (state, action) => {
      const itemPresent = state.cart.find(
        (item) => item.code === action.payload.code
      )
      if (itemPresent) {
        itemPresent.qteP++
      } else {
        state.cart.push({ ...action.payload, qteP: 1, qte: 0 })
      }
    },
    incrementQuantityP: (state, action) => {
      const itemPresent = state.cart.find(
        (item) => item.code === action.payload.code
      )
      itemPresent.qteP++
    },
    decrementQuantityP: (state, action) => {
      const itemPresent = state.cart.find(
        (item) => item.code === action.payload.code
      )
      if (itemPresent.qteP == 1) {
        itemPresent.qteP = 0
        const removeItem = state.cart.filter(
          (item) => item.code !== action.payload.code
        )
        state.cart = removeItem
      } else {
        itemPresent.qteP--
      }
    },
    cleanCart: (state) => {
      state.cart = []
    },
  },
})

export const {
  addToCart,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  addToCartP,
  incrementQuantityP,
  decrementQuantityP,
  cleanCart,
} = CartSlice.actions

export default CartSlice.reducer
