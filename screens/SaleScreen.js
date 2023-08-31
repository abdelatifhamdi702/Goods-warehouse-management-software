import { StyleSheet, View, TextInput, ScrollView, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Feather } from '@expo/vector-icons'
import Checkbox from 'expo-checkbox'
import ProductItem from '../components/ProductItem'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import {
  collection,
  getDoc,
  getDocs,
  query,
  limit,
  where,
  orderBy,
} from 'firebase/firestore'
import { db } from '../firebase'
import { cleanCart } from '../CartReducer'

const SaleScreen = ({ route }) => {
  const dispatch = useDispatch()
  const { isGros, isSuperGros } = route.params
  const [status, setStatus] = useState('Détail')
  const [isCheckedGros, setCheckedGros] = useState(false)
  const [isCheckedSuperGros, setCheckedSuperGros] = useState(false)
  const [isCheckedDetail, setCheckedDetail] = useState(true)
  const cart = useSelector((state) => state.cart.cart)
  const [items, setItems] = useState([])
  const total = cart
    .map((item) => item.qte * item.price * item.quantity)
    .reduce((curr, prev) => curr + prev, 0)
  const navigation = useNavigation()
  const [products, setProducts] = useState(
    useSelector((state) => state.product.product)
  )

  const [searchText, setSearchText] = useState('')

  const handleSearch = async () => {
    setProducts([])
    const colRef = query(
      collection(db, 'products'),
      where('name', '>=', searchText),
      limit(20)
    )
    const docsSnap = await getDocs(colRef)
    let array = []
    docsSnap.forEach((doc) => {
      array.push({ ...doc.data(), qte: 0 })
    })
    setItems(array)
    //items?.map((service) => dispatch(getProducts(service)))
  }
  const defaultList = async () => {
    setProducts([])
    const colRef = query(
      collection(db, 'products'),
      where('featured', '==', true),
      orderBy('code', 'asc')
    )
    const docsSnap = await getDocs(colRef)
    let array = []
    docsSnap.forEach((doc) => {
      array.push({ ...doc.data(), qte: 0 })
    })
    setItems(array)
    //items?.map((service) => dispatch(getProducts(service)))
  }
  useEffect(() => {
    if (isCheckedDetail) {
      setStatus('Détail')
    }
    if (isCheckedGros) {
      setStatus('Gros')
    }
    if (isCheckedSuperGros) {
      setStatus('Super Gros')
    }
    if (searchText == '') {
      defaultList()
    } else {
      handleSearch()
    }
  }, [searchText, isCheckedGros, isCheckedDetail, isCheckedSuperGros])
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
            placeholder="Chercher un produit"
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
            style={{ width: '80%' }}
          />
          <Feather name="search" size={24} color="#00b0f0" />
          <Feather
            name="shopping-cart"
            size={24}
            color="#00b0f0"
            onPress={() => {
              navigation.navigate('Cart', { isGros: status })
            }}
          />
        </View>
        <View>
          <View style={styles.container}>
            <View style={styles.section}>
              {(isGros || isSuperGros) && (
                <>
                  <Checkbox
                    style={styles.checkbox}
                    value={isCheckedDetail}
                    onValueChange={() => {
                      setCheckedDetail(true)
                      setCheckedGros(false)
                      setCheckedSuperGros(false)
                    }}
                    color={'#00b0f0'}
                  />
                  <Text style={styles.paragraph}>Détail</Text>
                </>
              )}
              {isGros && (
                <>
                  <Checkbox
                    style={styles.checkbox}
                    value={isCheckedGros}
                    onValueChange={() => {
                      setCheckedDetail(false)
                      setCheckedGros(true)
                      setCheckedSuperGros(false)
                    }}
                    color={'#00b0f0'}
                  />
                  <Text style={styles.paragraph}>Gros</Text>
                </>
              )}
              {isSuperGros && (
                <>
                  <Checkbox
                    style={styles.checkbox}
                    value={isCheckedSuperGros}
                    onValueChange={() => {
                      setCheckedDetail(false)
                      setCheckedGros(false)
                      setCheckedSuperGros(true)
                    }}
                    color={'#00b0f0'}
                  />
                  <Text style={styles.paragraph}>Super Gros</Text>
                </>
              )}
              <Feather
                style={{ marginLeft: 30, marginRight: 8 }}
                name="minus-circle"
                size={24}
                color="#00b0f0"
                onPress={() => {
                  dispatch(cleanCart())
                }}
              />
              <Text style={styles.paragraph}>Reset</Text>
            </View>
          </View>
        </View>
        {/* Render all the Products */}
        {items.map((item, index) => (
          <ProductItem item={item} isGros={status} key={index} />
        ))}
      </ScrollView>
    </>
  )
}

export default SaleScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paragraph: {
    fontSize: 15,
  },
  checkbox: {
    margin: 8,
  },
})
