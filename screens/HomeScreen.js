import { ScrollView } from 'react-native'
import React from 'react'
import Services from '../components/Services'

const HomeScreen = () => {
  return (
    <>
      <ScrollView
        style={{ backgroundColor: '#F0F0F0', flex: 1, marginTop: 50 }}
      >
        {/* Services Component */}
        <Services />
      </ScrollView>
    </>
  )
}

export default HomeScreen
