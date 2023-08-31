import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Image,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import React from 'react'

const Services = () => {
  const navigation = useNavigation()
  return (
    <View style={{ padding: 10 }}>
      <ScrollView>
        <Pressable
          style={{
            margin: 10,
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 7,
          }}
          key={1}
          onPress={async () => {
            const userDataString = await AsyncStorage.getItem('userData')
            const userData = JSON.parse(userDataString)
            const isGros = userData.isGros
            const isSuperGros = userData.isSuperGros
            navigation.navigate('Sale', { isGros, isSuperGros })
          }}
        >
          <MaterialCommunityIcons
            name="basket-plus"
            size={70}
            color="#00b0f0"
          />

          <Text style={{ textAlign: 'center', marginTop: 10 }}>
            {'Crée une vente'}
          </Text>
        </Pressable>
        <Pressable
          style={{
            margin: 10,
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 7,
          }}
          key={2}
          onPress={() => navigation.navigate('Client')}
        >
          <MaterialCommunityIcons
            name="account-group"
            size={70}
            color="#00b0f0"
          />

          <Text style={{ textAlign: 'center', marginTop: 10 }}>
            {'Mes Clients'}
          </Text>
        </Pressable>
        <Pressable
          style={{
            margin: 10,
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 7,
          }}
          key={3}
          onPress={() => navigation.navigate('MyBills')}
        >
          <MaterialCommunityIcons name="warehouse" size={70} color="#00b0f0" />

          <Text style={{ textAlign: 'center', marginTop: 10 }}>
            {'Mes Achats'}
          </Text>
        </Pressable>
        <Pressable
          style={{
            margin: 10,
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 7,
          }}
          key={4}
          onPress={() => navigation.navigate('MySales')}
        >
          <MaterialCommunityIcons
            name="truck-delivery"
            size={70}
            color="#00b0f0"
          />

          <Text style={{ textAlign: 'center', marginTop: 10 }}>
            {'Mes Vents'}
          </Text>
        </Pressable>
        <Pressable
          style={{
            margin: 10,
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 7,
          }}
          key={5}
          onPress={async () => {
            await AsyncStorage.clear()
            navigation.navigate('Login')
          }}
        >
          <MaterialCommunityIcons name="logout" size={70} color="#00b0f0" />

          <Text style={{ textAlign: 'center', marginTop: 10 }}>{'Lagout'}</Text>
        </Pressable>
      </ScrollView>
    </View>
  )
}

export default Services

const styles = StyleSheet.create({})
