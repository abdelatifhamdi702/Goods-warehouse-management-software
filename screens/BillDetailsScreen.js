import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  TextInput,
  Alert,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'

const BillDetailsScreen = ({ route }) => {
  const { bill } = route.params
  function getSpaces(text) {
    return '  '.repeat(10 - text.length)
  }
  const navigation = useNavigation()
  const cartItems = bill
  const totalPrice = cartItems
    .map(
      (item) =>
        parseInt(item.quantity) * parseFloat(item.price) * parseInt(item.colis)
    )
    .reduce((curr, prev) => curr + prev, 0)

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemPrice}>
        {' '}
        x{item.quantity}
        {getSpaces(
          (
            parseInt(item.quantity) *
            parseFloat(item.price) *
            parseInt(item.colis)
          ).toFixed(2) + ''
        )}
        {(
          parseInt(item.quantity) *
          parseFloat(item.price) *
          parseInt(item.colis)
        ).toFixed(2)}
      </Text>
    </View>
  )

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Facture</Text>
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.code}
      />
      <View style={styles.total}>
        <Text style={styles.totalText}>Total:</Text>
        <Text style={styles.totalPrice}>{totalPrice.toFixed(2)} DA</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    color: '#318CE7',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemName: {
    fontSize: 16,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  total: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
  },
})

export default BillDetailsScreen
