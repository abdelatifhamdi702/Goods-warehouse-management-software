import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Modal,
  TextInput,
  Button,
  Alert,
} from 'react-native'
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
import { MaterialIcons } from '@expo/vector-icons'
import React, { useState } from 'react'

const ClientItem = ({ item }) => {
  const [visible, setVisible] = useState(false)
  const [clicked, setClicked] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const handleOpen = () => {
    setVisible(true)
  }

  const handleClose = () => {
    setVisible(false)
    setInputValue('')
  }

  const handleConfirm = async () => {
    if (!clicked) {
      setClicked(true)
      let myclientId = item.id
      const docRef = doc(db, 'myclients', myclientId)
      const docSnap = await getDoc(docRef)
      let oldCredit = docSnap.data().credit
      let oldTotal = docSnap.data().total
      await updateDoc(doc(db, 'myclients', myclientId), {
        credit: parseFloat(oldCredit) - parseFloat(inputValue),
        total: parseFloat(oldTotal) + parseFloat(inputValue),
      })
      Alert.alert('Opération réussie', 'Le versement a été validé avec succès!')
      handleClose()
    }
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
            Crédit : {item.credit}
          </Text>
          <Text style={{ color: 'gray', fontSize: 15 }}>
            Total versement : {item.total}{' '}
          </Text>
          <MaterialIcons
            name="payment"
            size={24}
            color="#00b0f0"
            onPress={handleOpen}
          />
        </View>
      </Pressable>
      <Modal visible={visible} animationType="slide" transparent={true}>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <View style={{ backgroundColor: 'white', padding: 20 }}>
            <Text>Entrez le montant du paiement :</Text>
            <TextInput
              value={inputValue}
              onChangeText={setInputValue}
              keyboardType="decimal-pad"
              style={{
                borderWidth: 1,
                borderColor: 'gray',
                padding: 5,
                marginTop: 10,
              }}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10,
              }}
            >
              <Button title="Annuler" onPress={handleClose} />
              <Button title="Confirmer" onPress={handleConfirm} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default ClientItem

const styles = StyleSheet.create({})
