import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import SwipeButton from './SwipeButton'

const App = () => {
  return (
    < SafeAreaView 
    style={{flex:1,
    alignItems: 'center',
    justifyContent : 'center',
    alignSelf : 'center'}}>
      <Text>Swipeable Button</Text>
      <SwipeButton />
    </SafeAreaView>
  )
}

export default App

const styles = StyleSheet.create({})