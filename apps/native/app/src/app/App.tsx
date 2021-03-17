import React from 'react'
import { SafeAreaView, StatusBar, Image } from 'react-native'
import { Button } from '@island.is/island-ui-native'
// import { WebView } from 'react-native-webview'
import logo from './logo.png';

const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView
        style={{
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Button>Prufu takki</Button>
        <Image source={logo} resizeMode="contain" style={{ width: 200, height: 200 }} />
        {/* <WebView
          source={{ uri: 'https://island.is/' }}
          style={{ width: 400, height: 200 }}
        /> */}
      </SafeAreaView>
    </>
  )
}

export default App
