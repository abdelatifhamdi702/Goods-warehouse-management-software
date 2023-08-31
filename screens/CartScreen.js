import React, { useState, useEffect } from 'react'
import { Picker } from '@react-native-picker/picker'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  TextInput,
  Alert,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../firebase'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import { cleanCart } from '../CartReducer'

const CartScreen = ({ route }) => {
  const { isGros } = route.params
  function getSpaces(text) {
    return '  '.repeat(9 - text.length)
  }
  const [inputValue, setInputValue] = useState(0)
  const [isValid, setIsValid] = useState(false)
  const handleInputChange = (text) => {
    setInputValue(text)
  }
  const dispatch = useDispatch()
  const [clients, setClients] = useState([])
  const [selectedClient, setSelectedClient] = useState('')
  //const [saleId, setSaleId] = useState('')
  const navigation = useNavigation()
  const cartItems = useSelector((state) => state.cart.cart)
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
  const totalPrice = getTotalPrice(isGros, cartItems)
  const getClients = async () => {
    setClients([])
    const userDataString = await AsyncStorage.getItem('userData')
    const userData = JSON.parse(userDataString)
    const colRef = query(
      collection(db, 'myclients'),
      where('clientId', '==', userData.id)
    )
    const docsSnap = await getDocs(colRef)
    let array = []
    docsSnap.forEach((doc) => {
      array.push({ ...doc.data(), id: doc.id })
    })
    setClients(array)
  }
  function formatDate(date) {
    var year = date.getFullYear()
    var month = ('0' + (date.getMonth() + 1)).slice(-2)
    var day = ('0' + date.getDate()).slice(-2)
    var hours = ('0' + date.getHours()).slice(-2)
    var minutes = ('0' + date.getMinutes()).slice(-2)
    var seconds = ('0' + date.getSeconds()).slice(-2)

    var formattedDate =
      year +
      '-' +
      month +
      '-' +
      day +
      ' ' +
      hours +
      ':' +
      minutes +
      ':' +
      seconds
    return formattedDate
  }
  const goHome = async () => {
    dispatch(cleanCart())
    navigation.navigate('Home')
  }
  const goPrint = async () => {
    const userDataString = await AsyncStorage.getItem('userData')
    const userData = JSON.parse(userDataString)
    navigation.navigate('Print', {
      clientName: selectedClient,
      livreurName: userData.username,
      isGros: isGros,
    })
  }
  const getSelectedKey = () => {
    const selectedOption = clients.find(
      (option) => option.name === selectedClient
    )
    return selectedOption ? selectedOption.id : ''
  }

  const addSale = async () => {
    if (!isValid) {
      setIsValid(true)
      var currentDate = new Date()
      var formattedDate = formatDate(currentDate)
      const userDataString = await AsyncStorage.getItem('userData')
      const userData = JSON.parse(userDataString)
      let myclientId = getSelectedKey()
      const docRef = doc(db, 'myclients', myclientId)
      const docSnap = await getDoc(docRef)
      let oldCredit = docSnap.data().credit
      let oldTotal = docSnap.data().total
      let updatedCredit =
        parseFloat(totalPrice) - parseFloat(inputValue) + parseFloat(oldCredit)
      let updatedTotal = parseFloat(oldTotal) + parseFloat(inputValue)
      await updateDoc(doc(db, 'myclients', myclientId), {
        credit: updatedCredit.toFixed(2),
        total: updatedTotal.toFixed(2),
      })
      const stock = doc(db, 'stock', userData.id)
      const stockSnap = await getDoc(stock)
      const stockProducts = stockSnap.data().stock || []
      const updatedProductsArray = [...stockProducts]

      cartItems.forEach((cartProduct) => {
        const existingProductIndex = updatedProductsArray.findIndex(
          (product) => product.code === cartProduct.code
        )
        if (existingProductIndex !== -1) {
          var newQuantity =
            parseInt(updatedProductsArray[existingProductIndex].quantity) -
            (parseInt(cartProduct.qte) * parseInt(cartProduct.quantity) +
              parseInt(cartProduct.qteP))
          var newColis =
            parseInt(updatedProductsArray[existingProductIndex].colis) -
            parseInt(cartProduct.qte)
          updatedProductsArray[existingProductIndex].quantity = newQuantity
          updatedProductsArray[existingProductIndex].colis = newColis
          updatedProductsArray[existingProductIndex].total =
            parseFloat(updatedProductsArray[existingProductIndex].price) *
            newQuantity
        }
      })
      await updateDoc(doc(db, 'stock', userData.id), {
        stock: updatedProductsArray,
      })

      addDoc(collection(db, 'sales'), {
        isGros: isGros,
        payment: parseFloat(inputValue).toFixed(2),
        total: totalPrice.toFixed(2),
        cart: cartItems,
        createdAt: formattedDate,
        clientId: userData.id,
        myclientName: selectedClient,
        myclientId: myclientId,
      })

      Alert.alert('Opération réussie', 'La facture a été validé avec succès!', [
        { text: 'Non', style: 'cancel', onPress: goHome },
        { text: 'Imprimer', onPress: goPrint },
      ])
    }
  }
  useEffect(() => {
    getClients()
  }, [])
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
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.itemName}>{item.name}</Text>
      {tempItem(isGros, item)}
    </View>
  )

  return (
    <View style={styles.container}>
      <View>
        <Picker
          selectedValue={selectedClient}
          onValueChange={(itemValue) => setSelectedClient(itemValue)}
        >
          {clients.map((client, index) => (
            <Picker.Item key={index} label={client.name} value={client.name} />
          ))}
        </Picker>
      </View>
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
        <Text style={styles.totalText}>Versement:</Text>
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
            width: 300,
            marginVertical: 10,
          }}
        />
      </View>
      <Pressable
        onPress={addSale}
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
          Valider
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

export default CartScreen
