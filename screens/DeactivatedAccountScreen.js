import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

const DeactivatedAccountScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Votre compte a été désactivé</Text>
      <Text style={styles.description}>
        Contacter le responsable pour plus d'informations.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
})

export default DeactivatedAccountScreen
