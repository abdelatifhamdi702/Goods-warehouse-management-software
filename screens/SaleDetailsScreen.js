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
import { Feather } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  updateDoc,
  deleteDoc,
  where,
  orderBy,
} from 'firebase/firestore'
import { db } from '../firebase'

const SaleDetailsScreen = ({ route }) => {
  const { id, sale, isGros, total, payment, myclientId, myclientName } =
    route.params
  const [inputValue, setInputValue] = useState(payment)
  const [isValid, setIsValid] = useState(false)
  const handleInputChange = (text) => {
    setInputValue(text)
  }
  const [update, setUpdate] = useState(false)
  function getSpaces(text) {
    return '  '.repeat(10 - text.length)
  }
  const navigation = useNavigation()
  var cartItems = sale
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
  function getTotalPrice(code, cartItems) {
    var price = '0.0'
    if (code == 'Détail') {
      price = cartItems
        .map(
          (item) =>
            parseInt(item.qte) *
              parseFloat(item.prix1) *
              parseInt(item.quantity) +
            parseInt(item.qteP) * parseFloat(item.prix1)
        )
        .reduce((curr, prev) => curr + prev, 0)
    }
    if (code == 'Gros') {
      price = cartItems
        .map(
          (item) =>
            parseInt(item.qte) *
              parseFloat(item.prix2) *
              parseInt(item.quantity) +
            parseInt(item.qteP) * parseFloat(item.prix2)
        )
        .reduce((curr, prev) => curr + prev, 0)
    }
    if (code == 'Super Gros') {
      price = cartItems
        .map(
          (item) =>
            parseInt(item.qte) *
              parseFloat(item.prix3) *
              parseInt(item.quantity) +
            parseInt(item.qteP) * parseFloat(item.prix3)
        )
        .reduce((curr, prev) => curr + prev, 0)
    }
    return price
  }
  var totalPrice = getTotalPrice(isGros, cartItems)

  const tempItem = (code, item) => {
    var price = getPrice(code, item)
    return (
      <Text style={styles.itemPrice}>
        {' '}
        x{parseInt(item.qte) * parseInt(item.quantity) + parseInt(item.qteP)}
        {getSpaces(
          (
            parseInt(item.qte) * parseFloat(price) * parseInt(item.quantity) +
            parseInt(item.qteP) * parseFloat(price)
          ).toFixed(2) + ''
        )}
        {(
          parseInt(item.qte) * parseFloat(price) * parseInt(item.quantity) +
          parseInt(item.qteP) * parseFloat(price)
        ).toFixed(2)}
      </Text>
    )
  }
  const deleteSale = async (item) => {
    const indexToRemove = cartItems.indexOf(item)
    if (indexToRemove !== -1) {
      cartItems.splice(indexToRemove, 1)
      totalPrice = getTotalPrice(isGros, cartItems)
    }

    const userDataString = await AsyncStorage.getItem('userData')
    const userData = JSON.parse(userDataString)
    const docRef = doc(db, 'stock', userData.id)
    const docSnap = await getDoc(docRef)
    const existingProductsArray = docSnap.data().stock || []
    existingProductsArray.forEach((element, index) => {
      if (element.code === item.code) {
        var newQuantity =
          parseInt(element.quantity) +
          (parseInt(item.qte) * parseInt(item.quantity) + parseInt(item.qteP))
        var newColis = parseInt(element.colis) + parseInt(item.qte)
        var newTotal =
          parseFloat(updatedProductsArray[existingProductIndex].price) *
          newQuantity
        existingProductsArray[index] = {
          ...element,
          colis: newColis,
          quantity: newQuantity,
          total: newTotal,
        }
      }
    })
    await updateDoc(doc(db, 'stock', userData.id), {
      stock: existingProductsArray,
    })
    await updateDoc(doc(db, 'sales', id), {
      cart: cartItems,
      total: totalPrice,
    })
    const docRefmyclient = doc(db, 'myclients', myclientId)
    const docSnapmyclient = await getDoc(docRefmyclient)
    var diff = total - (total - totalPrice)
    var newCredit =
      parseFloat(docSnapmyclient.data().credit) -
      (parseFloat(total) - parseFloat(payment)) +
      (diff - parseFloat(payment))
    await updateDoc(doc(db, 'myclients', docSnapmyclient.id), {
      credit: newCredit.toFixed(2),
    })
    Alert.alert('Opération réussie', 'Le produit a été supprimé avec succès!')
    setUpdate(!update)
  }
  const nothing = () => {}
  const handleDeleteSale = (item) => {
    Alert.alert('Es-tu sûr?', 'Vous ne pourrez pas revenir en arrière!', [
      { text: 'Nom', style: 'cancel', onPress: nothing },
      {
        text: 'Oui, supprimez-le!',
        onPress: () => {
          deleteSale(item)
        },
      },
    ])
  }
  const goPrint = async () => {
    const userDataString = await AsyncStorage.getItem('userData')
    const userData = JSON.parse(userDataString)
    navigation.navigate('Print2', {
      clientName: myclientName,
      livreurName: userData.username,
      isGros: isGros,
      cartItems: cartItems,
    })
  }
  const handleConfirm = async () => {
    if (!isValid) {
      setIsValid(true)
      const docRef = doc(db, 'myclients', myclientId)
      const docSnap = await getDoc(docRef)
      let oldCredit = docSnap.data().credit
      let oldTotal = docSnap.data().total
      let diff = parseFloat(inputValue) - parseFloat(payment)
      await updateDoc(doc(db, 'myclients', myclientId), {
        credit: parseFloat(oldCredit) - diff,
        total: parseFloat(oldTotal) + diff,
      })
      await updateDoc(doc(db, 'sales', id), {
        payment: parseFloat(inputValue).toFixed(2),
      })
      Alert.alert('Opération réussie', 'Le versement a été validé avec succès!')
    }
  }
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.itemName}>
        {item.name.toString().substring(0, 18)}
      </Text>
      {tempItem(isGros, item)}
      <Feather
        style={{ marginLeft: 10, marginRight: 5 }}
        name="x-square"
        size={24}
        color="red"
        onPress={() => {
          handleDeleteSale(item)
        }}
      />
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
      <View style={styles.total}>
        <TextInput
          value={inputValue}
          onChangeText={handleInputChange}
          keyboardType="decimal-pad"
          style={{
            fontSize: inputValue ? 16 : 16,
            fontWeight: 'bold',
            borderBottomWidth: 1,
            borderBottomColor: 'gray',
            marginLeft: 13,
            width: 200,
            marginVertical: 10,
          }}
        />
        <Pressable
          onPress={handleConfirm}
          style={{
            width: 160,
            backgroundColor: '#318CE7',
            padding: 10,
            borderRadius: 7,
            marginTop: 20,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          <Text style={{ fontSize: 14, textAlign: 'center', color: 'white' }}>
            Modifier Versement
          </Text>
        </Pressable>
      </View>
      <Pressable
        onPress={goPrint}
        style={{
          width: 150,
          backgroundColor: '#318CE7',
          padding: 10,
          borderRadius: 7,
          marginTop: 20,
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        <Text style={{ fontSize: 14, textAlign: 'center', color: 'white' }}>
          Imprimer
        </Text>
      </Pressable>
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

export default SaleDetailsScreen
