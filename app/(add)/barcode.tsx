import { Redirect, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {  View,Text, SafeAreaView, Animated, TouchableOpacity, Alert, FlatList } from 'react-native';
import Tabs from '@/components/Tabs';
import { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import SegmentedControl from '@/components/SegmentedControl';
import { CameraView, CameraType, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { booksService } from '@/services/booksService';
import { Book } from '@/lib/types';
import { FlashList } from '@shopify/flash-list';


const options =[

  'Scanner',
  'Scanned'
]



const Barcode = () => {
    const [recentScans, setRecentScans] = useState<BarcodeScanningResult[]>([])
    const [books, setBooks] = useState<Book[] | null>(null)
    const [selectedOption, setSelectedOption] = useState<string>('Scanner')
    const [isScannerActive, setIsScannerActive] = useState<boolean>(false)
  const router = useRouter()

  useEffect(() => {
    
    if(selectedOption === 'Scanner'){
      setIsScannerActive(true)
    }
    else{
      setIsScannerActive(false)
    }
  }, [selectedOption])

  const handleBarcodeScanned = async (result: BarcodeScanningResult) => {
    console.log(result)
  
    if(result.type != 'ean13'){
      Alert.alert('Invalid Barcode', 'Please scan a valid EAN-13 barcode')
    }
    else{

     
    try {
      // Get book details first
      const bookDetails = await booksService.searchBooks(result.data);

      if(bookDetails){

        setRecentScans((prev) => {
          if (prev.some(scan => scan.data === result.data)) {
              return prev; // Skip if duplicate
          }
          return [{
              ...result,
          }, ...prev];
      });
      // Optionally set the book details in a separate state
      setBooks([...bookDetails, bookDetails]);

      return bookDetails;
      }
      
      throw new Error('Failed to get book details')
      // Then update state with both the scan and book details
    
  } catch (error) {
      console.error('Error getting book details:', error);
      Alert.alert('Error', 'Failed to get book details');
  }
    }
    
  }


 


    return (
        <SafeAreaView className='flex-1 '>
          <View className='flex items-center justify-center'>
          <SegmentedControl options={options} selectedOption={selectedOption} onOptionPress={setSelectedOption}/>
          </View>
          {selectedOption === 'Scanner' && (
              <CameraView facing={"back"} style={{flex:1}} onBarcodeScanned={handleBarcodeScanned} barcodeScannerSettings={{barcodeTypes: ['ean13']}}/>
          )}
          {selectedOption === 'Scanned' && (
            <View className='flex-1 items-center justify-center'>
             
            </View>
          )}
      
        </SafeAreaView>
    );
}

export default Barcode;

