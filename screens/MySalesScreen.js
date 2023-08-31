import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Alert,
} from 'react-native'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import { useNavigation } from '@react-navigation/native'
import { Feather } from '@expo/vector-icons'
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
import AsyncStorage from '@react-native-async-storage/async-storage'

const MySalesScreen = () => {
  const navigation = useNavigation()
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false)
  const [isDatePickerVisibleEnd, setDatePickerVisibilityEnd] = useState(false)
  const getData = async () => {
    const userDataString = await AsyncStorage.getItem('userData')
    const userData = JSON.parse(userDataString)
    const colRef = query(
      collection(db, 'sales'),
      where('clientId', '==', userData.id),
      orderBy('createdAt', 'desc')
      //limit(10)
    )
    const docsSnap = await getDocs(colRef)
    let array = []
    docsSnap.forEach((doc) => {
      array.push({ ...doc.data(), id: doc.id })
    })
    setSalesData(array)
  }
  useEffect(() => {
    getData()
  }, [])
  const showDatePicker = () => {
    setDatePickerVisibility(true)
  }
  const showDatePickerEnd = () => {
    setDatePickerVisibilityEnd(true)
  }
  const hideDatePicker = () => {
    setDatePickerVisibility(false)
  }
  const hideDatePickerEnd = () => {
    setDatePickerVisibilityEnd(false)
  }
  const handleConfirm = (date) => {
    setStartDate(date)
    hideDatePicker()
  }
  const handleConfirmEnd = (date) => {
    setEndDate(date)
    hideDatePickerEnd()
  }

  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [salesData, setSalesData] = useState([])
  function getDate(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    const dateString = `${year}-${month}-${day}`
    return dateString
  }
  const handleFilter = async () => {
    const userDataString = await AsyncStorage.getItem('userData')
    const userData = JSON.parse(userDataString)
    const colRef = query(
      collection(db, 'sales'),
      where('clientId', '==', userData.id),
      where('createdAt', '>=', getDate(startDate)),
      where('createdAt', '<=', getDate(endDate)),
      orderBy('createdAt', 'desc')
      //limit(10)
    )
    const docsSnap = await getDocs(colRef)
    let array = []
    docsSnap.forEach((doc) => {
      array.push({ ...doc.data(), id: doc.id })
    })
    setSalesData(array)
  }

  const handleSaleDetails = (
    id,
    sale,
    isGros,
    total,
    payment,
    myclientId,
    myclientName
  ) => {
    // Navigate to the SaleDetailsScreen with the selected sale
    navigation.navigate('SaleDetails', {
      id,
      sale,
      isGros,
      total,
      payment,
      myclientId,
      myclientName,
    })
  }
  const deleteSale = async (id, total, payment, cid) => {
    const userDataString = await AsyncStorage.getItem('userData')
    const userData = JSON.parse(userDataString)
    const docRef = doc(db, 'stock', userData.id)
    const docSnap = await getDoc(docRef)
    const existingProductsArray = docSnap.data().stock || []
    const docRefSale = doc(db, 'sales', id)
    const docSnapSale = await getDoc(docRefSale)
    var tableData = docSnapSale.data().cart
    tableData.forEach((product) => {
      existingProductsArray.forEach((element, index) => {
        if (element.code === product.code) {
          var newQuantity =
            parseInt(element.quantity) +
            (parseInt(product.qte) * parseInt(product.quantity) +
              parseInt(product.qteP))
          var newColis = parseInt(element.colis) + parseInt(product.qte)
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
    })
    await updateDoc(doc(db, 'stock', userData.id), {
      stock: existingProductsArray,
    })
    await deleteDoc(doc(db, 'sales', id))
    const docRefmyclient = doc(db, 'myclients', cid)
    const docSnapmyclient = await getDoc(docRefmyclient)
    var newTotal =
      parseFloat(docSnapmyclient.data().total) - parseFloat(payment)
    var newCredit =
      parseFloat(docSnapmyclient.data().credit) -
      (parseFloat(total) - parseFloat(payment))
    await updateDoc(doc(db, 'myclients', docSnapmyclient.id), {
      credit: newCredit.toFixed(2),
      total: newTotal.toFixed(2),
    })
    Alert.alert('Opération réussie', 'Le vent a été supprimé avec succès!')
  }
  const nothing = () => {}
  const handleDeleteSale = (id, total, payment, cid) => {
    Alert.alert('Es-tu sûr?', 'Vous ne pourrez pas revenir en arrière!', [
      { text: 'Nom', style: 'cancel', onPress: nothing },
      {
        text: 'Oui, supprimez-le!',
        onPress: () => {
          deleteSale(id, total, payment, cid)
        },
      },
    ])
  }

  const renderSaleItem = ({ item }) => (
    <View style={styles.saleItem}>
      <Text>{item.myclientName}</Text>
      <Text>{item.createdAt.substring(0, 10)}</Text>
      <Text>{parseFloat(item.total).toFixed(2)}</Text>
      <Feather
        name="trash"
        size={24}
        color="red"
        onPress={() => {
          handleDeleteSale(item.id, item.total, item.payment, item.myclientId)
        }}
      />
      <Feather
        name="shopping-cart"
        size={24}
        color="#00b0f0"
        onPress={() => {
          handleSaleDetails(
            item.id,
            item.cart,
            item.isGros,
            item.total,
            item.payment,
            item.myclientId,
            item.myclientName
          )
        }}
      />
    </View>
  )

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mes Vents</Text>
      <View style={styles.btnsContainer}>
        <Pressable
          onPress={showDatePicker}
          style={{
            width: 100,
            backgroundColor: '#00b0f0',
            padding: 10,
            borderRadius: 7,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          <Text style={{ fontSize: 14, textAlign: 'center', color: 'white' }}>
            Date Début
          </Text>
        </Pressable>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
        <Pressable
          onPress={showDatePickerEnd}
          style={{
            width: 100,
            backgroundColor: '#00b0f0',
            padding: 10,
            borderRadius: 7,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          <Text style={{ fontSize: 14, textAlign: 'center', color: 'white' }}>
            Date Fin
          </Text>
        </Pressable>
        <DateTimePickerModal
          isVisible={isDatePickerVisibleEnd}
          mode="date"
          onConfirm={handleConfirmEnd}
          onCancel={hideDatePickerEnd}
        />
        <Pressable
          onPress={handleFilter}
          style={{
            width: 100,
            backgroundColor: '#00b0f0',
            padding: 10,
            borderRadius: 7,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          <Text style={{ fontSize: 14, textAlign: 'center', color: 'white' }}>
            Filtrer
          </Text>
        </Pressable>
      </View>
      <FlatList
        data={salesData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderSaleItem}
      />
    </View>
  )
}

export default MySalesScreen

const styles = StyleSheet.create({
  btnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 20,
    textAlign: 'center',
  },
  btn: {
    backgroundColor: '#00b0f0',
    color: '#00b0f0',
  },
  saleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
})
