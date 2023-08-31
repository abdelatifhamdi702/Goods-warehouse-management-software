import {
  Image,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  ActivityIndicator,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Ionicons } from '@expo/vector-icons'
import React, { useEffect, useState } from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { db } from '../firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'
const LoginScreen = () => {
  const [username, setUserName] = useState('')
  const [loading, setLoading] = useState(false)
  const [authUser, setAuthUser] = useState(false)
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const navigation = useNavigation()

  useEffect(() => {
    async function isLoggedIn() {
      const userDataString = await AsyncStorage.getItem('userData')
      const userData = JSON.parse(userDataString)
      let updatedUserData
      if (userDataString !== null) {
        const q = query(
          collection(db, 'clients'),
          where('username', '==', userData.username),
          where('password', '==', userData.password)
        )
        const querySnapshot = await getDocs(q)
        const user = querySnapshot.size > 0
        if (user) {
          querySnapshot.forEach((doc) => {
            if (doc.data().active) {
              setAuthUser(true)
            } else {
              navigation.navigate('DeactivatedAccount')
            }
            updatedUserData = {
              id: doc.id,
              username: doc.data().username,
              password: doc.data().password,
              credit: doc.data().credit,
              total: doc.data().total,
              option: doc.data().option,
              isGros: doc.data().isGros,
              isSuperGros: doc.data().isSuperGros,
            }
          })
          // Save user data to AsyncStorage
          try {
            await AsyncStorage.clear()
            await AsyncStorage.setItem(
              'userData',
              JSON.stringify(updatedUserData)
            )
            console.log('User data saved successfully!')
          } catch (error) {
            console.log('Error saving user data:', error)
          }
        }
      } else {
        setAuthUser(false)
      }
    }
    setLoading(true)
    isLoggedIn()
    if (!authUser) {
      setLoading(false)
    }
    if (authUser) {
      navigation.replace('Home')
    }
  }, [authUser])

  const login = async () => {
    const q = query(
      collection(db, 'clients'),
      where('username', '==', username),
      where('password', '==', password)
    )
    const querySnapshot = await getDocs(q)
    const user = querySnapshot.size > 0
    if (user) {
      let userData
      querySnapshot.forEach((doc) => {
        if (doc.data().active) {
          setAuthUser(true)
        } else {
          navigation.navigate('DeactivatedAccount')
        }
        userData = {
          id: doc.id,
          username: doc.data().username,
          password: doc.data().password,
          credit: doc.data().credit,
          total: doc.data().total,
          option: doc.data().option,
          isGros: doc.data().isGros,
          isSuperGros: doc.data().isSuperGros,
        }
      })
      // Save user data to AsyncStorage
      try {
        await AsyncStorage.setItem('userData', JSON.stringify(userData))
        console.log('User data saved successfully!')
      } catch (error) {
        console.log('Error saving user data:', error)
      }

      //setAuthUser(true)
      setErrorMessage('')
    } else {
      setErrorMessage(
        "Ce compte n'existe pas! vérifier votre nom d'utilisateur et mot de passe."
      )
    }
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        padding: 10,
      }}
    >
      {loading ? (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            flex: 1,
          }}
        >
          <Text style={{ marginRight: 10 }}>Loading</Text>
          <ActivityIndicator size="large" color={'red'} />
        </View>
      ) : (
        <KeyboardAvoidingView>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 100,
            }}
          >
            <Text
              style={{ fontSize: 20, color: '#318CE7', fontWeight: 'bold' }}
            >
              Se connecter
            </Text>

            <Image
              source={require('../assets/Soummam.png')}
              style={{ width: 300, height: 200 }} // adjust the width and height as needed
            />

            <Text style={{ fontSize: 18, marginTop: 8, fontWeight: '600' }}>
              Connectez-vous à votre compte
            </Text>
          </View>

          <View style={{ marginTop: 50 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcons
                name="account-key"
                size={24}
                color="black"
              />
              <TextInput
                placeholder="Nom d'utilisateur"
                value={username}
                onChangeText={(text) => setUserName(text)}
                placeholderTextColor="black"
                style={{
                  fontSize: username ? 18 : 18,
                  borderBottomWidth: 1,
                  borderBottomColor: 'gray',
                  marginLeft: 13,
                  width: 300,
                  marginVertical: 10,
                }}
              />
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="key-outline" size={24} color="black" />
              <TextInput
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={true}
                placeholder="Mot de passe"
                placeholderTextColor="black"
                style={{
                  fontSize: password ? 18 : 18,
                  borderBottomWidth: 1,
                  borderBottomColor: 'gray',
                  marginLeft: 13,
                  width: 300,
                  marginVertical: 20,
                }}
              />
            </View>
          </View>
          <View style={{ width: '80%', alignSelf: 'center' }}>
            {errorMessage ? (
              <Text style={{ color: 'red', marginTop: 20 }}>
                {errorMessage}
              </Text>
            ) : null}

            <Pressable
              onPress={login}
              style={{
                width: 200,
                backgroundColor: '#318CE7',
                padding: 15,
                borderRadius: 7,
                marginTop: 50,
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              <Text
                style={{ fontSize: 18, textAlign: 'center', color: 'white' }}
              >
                Login
              </Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({})
