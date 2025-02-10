import { Redirect, useRouter } from 'expo-router';
import React from 'react';
import {  View,Text, SafeAreaView } from 'react-native';
import {  useCameraDevice, useCameraPermission, Camera, useCodeScanner } from 'react-native-vision-camera';



const Barcode = () => {
    const {hasPermission} = useCameraPermission()
  const redirectToPermissions = !hasPermission
  const router = useRouter()
  const device = useCameraDevice('back')

  const codeScanner = useCodeScanner({
    codeTypes: ['ean-13'],
    onCodeScanned: (codes) => {
      console.log(`Scanned ${codes.length} codes!`)
      codes.forEach(code => {
        console.log(code.value)
      })
    }
  })
  

  if(redirectToPermissions){
    return <Redirect href={'/(permissions)'}/>
  }

  if(!device){
    return <View className='flex-1 items-center justify-center'>
        <Text className='text-white text-2xl font-bold'>No device found</Text>
    </View>
  }

    return (

      
       
            <Camera style={{flex:1}} device={device} isActive={true} codeScanner={codeScanner}/>
  
  
     

    );



}

export default Barcode;

