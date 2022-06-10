import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Camera } from "expo-camera";
import { Tensorflow } from './src/components/Tensorflow';

export default function App() {

  const [hasPermission, setHasPermission] = useState(null)
  const [visibility, setVisibility] = useState(false)

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync()
      setHasPermission(status === 'granted')
    })()

  }, [])


  if (hasPermission === null)
    return <View />

  if (hasPermission === false)
    return <Text>No access to camera</Text>

  if (!visibility)
    return <Tensorflow camera={Camera} />
  else
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
