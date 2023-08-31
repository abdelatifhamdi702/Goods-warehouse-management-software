import { StyleSheet, View, Alert, TextInput, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Feather } from '@expo/vector-icons'
import ClientItem from '../components/ClientItem'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  collection,
  getDocs,
  addDoc,
  query,
  limit,
  where,
} from 'firebase/firestore'
import { db } from '../firebase'

const ClientScreen = () => {
  const [items, setItems] = useState([])
  const [searchText, setSearchText] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [isValid, setIsValid] = useState(false)

  const handleInputChange = (text) => {
    setInputValue(text)
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
  const addClient = async () => {
    if (!isValid) {
      setIsValid(true)
      var currentDate = new Date()
      var formattedDate = formatDate(currentDate)
      const userDataString = await AsyncStorage.getItem('userData')
      const userData = JSON.parse(userDataString)
      addDoc(collection(db, 'myclients'), {
        name: inputValue,
        total: 0,
        credit: 0,
        createdAt: formattedDate,
        clientId: userData.id,
      })
      Alert.alert('Opération réussie', 'Le client a été ajouté avec succès!')
    }
  }

  const handleSearch = async () => {
    const userDataString = await AsyncStorage.getItem('userData')
    const userData = JSON.parse(userDataString)
    const colRef = query(
      collection(db, 'myclients'),
      where('clientId', '==', userData.id),
      where('name', '>=', searchText),
      limit(3)
    )
    const docsSnap = await getDocs(colRef)
    let array = []
    docsSnap.forEach((doc) => {
      array.push({ ...doc.data(), qte: 0, id: doc.id })
    })
    setItems(array)
  }
  useEffect(() => {
    handleSearch()
  }, [searchText])
  return (
    <>
      <ScrollView
        style={{ backgroundColor: '#F0F0F0', flex: 1, marginTop: 50 }}
      >
        {/* Search Bar */}
        <View
          style={{
            padding: 10,
            margin: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderWidth: 0.8,
            borderColor: '#C0C0C0',
            borderRadius: 7,
          }}
        >
          <TextInput
            placeholder="Chercher un client"
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
            style={{ width: '80%' }}
          />
          <Feather name="search" size={24} color="#00b0f0" />
        </View>

        <View
          style={{
            padding: 10,
            margin: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderWidth: 0.8,
            borderColor: '#C0C0C0',
            borderRadius: 7,
          }}
        >
          <TextInput
            placeholder="Entrer le nom de client"
            value={inputValue}
            onChangeText={handleInputChange}
            style={{ width: '80%' }}
          />
          <Feather name="plus" size={24} color="#00b0f0" onPress={addClient} />
        </View>

        {/* Render all the Products */}
        {items.map((item, index) => (
          <ClientItem item={item} key={index} />
        ))}
      </ScrollView>
    </>
  )
}

export default ClientScreen

const styles = StyleSheet.create({})
