import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Button,
  FlatList,
  Pressable,
} from 'react-native'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import { useNavigation } from '@react-navigation/native'
import { Feather } from '@expo/vector-icons'
import {
  collection,
  getDocs,
  query,
  limit,
  where,
  orderBy,
} from 'firebase/firestore'
import { db } from '../firebase'
import AsyncStorage from '@react-native-async-storage/async-storage'

const MyBillsScreen = () => {
  const navigation = useNavigation()
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false)
  const [isDatePickerVisibleEnd, setDatePickerVisibilityEnd] = useState(false)
  const getData = async () => {
    const userDataString = await AsyncStorage.getItem('userData')
    const userData = JSON.parse(userDataString)
    const colRef = query(
      collection(db, 'bills'),
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
      collection(db, 'bills'),
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

  const handleSaleDetails = (bill) => {
    // Navigate to the billDetailsScreen with the selected bill
    navigation.navigate('BillDetails', { bill })
  }

  const renderSaleItem = ({ item }) => (
    <View style={styles.saleItem}>
      <Text>{item.createdAt.substring(0, 16)}</Text>
      <Text>{parseFloat(item.total).toFixed(2)}</Text>
      <Feather
        name="shopping-cart"
        size={24}
        color="#00b0f0"
        onPress={() => {
          handleSaleDetails(item.products)
        }}
      />
    </View>
  )

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mes Achats</Text>
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

export default MyBillsScreen

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
