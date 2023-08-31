import { createSlice } from '@reduxjs/toolkit'

export const productSlice = createSlice({
  name: 'product',
  initialState: {
    product: [],
  },
  reducers: {
    resetSlice: (state) => {
      state.product.length = 0
    },
    getProducts: (state, action) => {
      state.product.push({ ...action.payload })
    },
    incrementQty: (state, action) => {
      const itemPresent = state.product.find(
        (item) => item.code === action.payload.code
      )
      itemPresent.qte++
    },
    decrementQty: (state, action) => {
      const itemPresent = state.product.find(
        (item) => item.code === action.payload.code
      )
      if (itemPresent.qte == 1) {
        itemPresent.qte = 0
        const removeItem = state.product.filter(
          (item) => item.code !== action.payload.code
        )
        state.cart = removeItem
      } else {
        itemPresent.qte--
      }
    },
  },
})

export const { getProducts, incrementQty, decrementQty, resetSlice } =
  productSlice.actions

export default productSlice.reducer
