import { StyleSheet, Text, View, Pressable, Image } from 'react-native'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  addToCart,
  decrementQuantity,
  incrementQuantity,
  addToCartP,
  decrementQuantityP,
  incrementQuantityP,
} from '../CartReducer'
//import { decrementQty, incrementQty } from '../ProductReducer'

const ProductItem = ({ item, isGros }) => {
  const dispatch = useDispatch()
  const cart = useSelector((state) => state.cart.cart)
  const addItemToCart = () => {
    dispatch(addToCart(item)) // cart
  }
  const addItemToCartP = () => {
    dispatch(addToCartP(item)) // cart
  }
  function getQte(code) {
    const foundObject = cart.find((item) => item.code === code)
    return foundObject.qte
  }
  function getQteP(code) {
    const foundObject = cart.find((item) => item.code === code)
    return foundObject.qteP
  }
  function getPrice(code, item) {
    var price = '0.0'
    if (code == 'Détail') {
      price = item.prix1
    }
    if (code == 'Gros') {
      price = item.prix2
    }
    if (code == 'Super Gros') {
      price = item.prix3
    }
    return price
  }
  return (
    <View>
      <Pressable
        style={{
          backgroundColor: '#F8F8F8',
          borderRadius: 8,
          padding: 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          margin: 14,
        }}
      >
        <View>
          <Text
            style={{
              fontSize: 17,
              fontWeight: '500',
              marginBottom: 7,
            }}
          >
            {item.name}
          </Text>
          <Text style={{ color: 'gray', fontSize: 15 }}>
            Qté par colis {item.quantity}
          </Text>
          <Text style={{ color: 'gray', fontSize: 15 }}>
            {getPrice(isGros, item)} DA
          </Text>
        </View>
        <View>
          {cart.some((c) => c.code === item.code) ? (
            <Pressable
              style={{
                flexDirection: 'row',
                paddingHorizontal: 10,
                paddingVertical: 5,
              }}
            >
              <Pressable
                onPress={() => {
                  dispatch(decrementQuantity(item)) // cart
                  //dispatch(decrementQty(item)) // product
                }}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 13,
                  borderColor: '#BEBEBE',
                  backgroundColor: '#E0E0E0',
                  justifyContent: 'center',
                  alignContent: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    color: '#00b0f0',
                    paddingHorizontal: 6,
                    fontWeight: '600',
                    textAlign: 'center',
                  }}
                >
                  -
                </Text>
              </Pressable>

              <Pressable>
                <Text
                  style={{
                    fontSize: 19,
                    color: '#00b0f0',
                    paddingHorizontal: 8,
                    fontWeight: '600',
                  }}
                >
                  {getQte(item.code)}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  dispatch(incrementQuantity(item)) // cart
                  //dispatch(incrementQty(item)) //product
                }}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 13,
                  borderColor: '#BEBEBE',
                  backgroundColor: '#E0E0E0',
                  justifyContent: 'center',
                  alignContent: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    color: '#00b0f0',
                    paddingHorizontal: 6,
                    fontWeight: '600',
                    textAlign: 'center',
                  }}
                >
                  +
                </Text>
              </Pressable>
            </Pressable>
          ) : (
            <Pressable onPress={addItemToCart} style={{ width: 80 }}>
              <Text
                style={{
                  borderColor: 'gray',
                  borderRadius: 4,
                  borderWidth: 0.8,
                  marginVertical: 10,
                  color: '#00b0f0',
                  textAlign: 'center',
                  padding: 5,
                  fontSize: 17,
                  fontWeight: 'bold',
                }}
              >
                Colis
              </Text>
            </Pressable>
          )}
          {cart.some((c) => c.code === item.code) ? (
            <Pressable
              style={{
                flexDirection: 'row',
                paddingHorizontal: 10,
                paddingVertical: 5,
              }}
            >
              <Pressable
                onPress={() => {
                  dispatch(decrementQuantityP(item)) // cart
                  //dispatch(decrementQty(item)) // product
                }}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 13,
                  borderColor: '#BEBEBE',
                  backgroundColor: '#E0E0E0',
                  justifyContent: 'center',
                  alignContent: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    color: '#00b0f0',
                    paddingHorizontal: 6,
                    fontWeight: '600',
                    textAlign: 'center',
                  }}
                >
                  -
                </Text>
              </Pressable>

              <Pressable>
                <Text
                  style={{
                    fontSize: 19,
                    color: '#00b0f0',
                    paddingHorizontal: 8,
                    fontWeight: '600',
                  }}
                >
                  {getQteP(item.code)}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  dispatch(incrementQuantityP(item)) // cart
                  //dispatch(incrementQty(item)) //product
                }}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 13,
                  borderColor: '#BEBEBE',
                  backgroundColor: '#E0E0E0',
                  justifyContent: 'center',
                  alignContent: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    color: '#00b0f0',
                    paddingHorizontal: 6,
                    fontWeight: '600',
                    textAlign: 'center',
                  }}
                >
                  +
                </Text>
              </Pressable>
            </Pressable>
          ) : (
            <Pressable onPress={addItemToCartP} style={{ width: 80 }}>
              <Text
                style={{
                  borderColor: 'gray',
                  borderRadius: 4,
                  borderWidth: 0.8,
                  marginVertical: 10,
                  color: '#00b0f0',
                  textAlign: 'center',
                  padding: 5,
                  fontSize: 17,
                  fontWeight: 'bold',
                }}
              >
                Pièce
              </Text>
            </Pressable>
          )}
        </View>
      </Pressable>
    </View>
  )
}

export default ProductItem

const styles = StyleSheet.create({})
