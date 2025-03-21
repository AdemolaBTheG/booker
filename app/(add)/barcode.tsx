import React, { useEffect, useState, useRef } from 'react';
import {  View, SafeAreaView, } from 'react-native';

import SegmentedControl from '@/components/SegmentedControl';
import { CameraView, BarcodeScanningResult } from 'expo-camera';
import { booksService } from '@/services/booksService';
import { Book } from '@/lib/types';
import { FlashList } from '@shopify/flash-list';
import BookItem from '@/components/BookItem';





const Barcode = () => {
    const [books, setBooks] = useState<Book[]>([])
    const [selectedOption, setSelectedOption] = useState<string>('Scanner')
    const [isScannerActive, setIsScannerActive] = useState<boolean>(false)
    const [barcode, setBarcode] = useState<string>('')
    const isMounted = useRef(true);


    const options =[

  'Scanner',
  `Scanned (${books.length})`


  
]

useEffect(() => {
    // Component mounted
    return () => {
        // Component will unmount
        isMounted.current = false;
        // Explicitly deactivate scanner
        setIsScannerActive(false);
    };
}, []);

    useEffect(() => {
        if(isMounted.current){
            setIsScannerActive(selectedOption === 'Scanner');
        }
       
    }, [selectedOption]);

    useEffect(() => {
        console.log(books)
    }, [books])

    const handleBarcodeScanned = async (result: BarcodeScanningResult) => {
        console.log(result.data)
        if(result.data !== barcode){
            setBarcode(result.data)
            const book = await booksService.getByISBN(result.data)
            setBooks([...books, book])
        }


     
    }

    return (
        <SafeAreaView className='flex-1 '>
            <View className='flex items-center justify-center'>
                <SegmentedControl 
                    options={options} 
                    selectedOption={selectedOption}
                    onOptionPress={setSelectedOption}
                />
            </View>
            {selectedOption === 'Scanner' ? (
                <CameraView 
                    active={isScannerActive} 
                    facing="back" 
                    style={{flex:1, marginTop: 12}} 
                    onBarcodeScanned={handleBarcodeScanned} 
                    barcodeScannerSettings={{barcodeTypes: ['ean13']}}
                  
                />
            ) : null}
            {options[1].includes(selectedOption) && (
                <View className='flex-1 flex-row justify-center mt-5 px-4'>
                    <FlashList 
                        data={books} 
                        renderItem={({item}) => <BookItem item={item} />} 
                        keyExtractor={(item) => item.id} 
                        estimatedItemSize={120}
                    />
                </View>
            )}
        </SafeAreaView>
    );
}

export default Barcode;

