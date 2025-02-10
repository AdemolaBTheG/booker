import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { CameraPermissionStatus, Camera } from "react-native-vision-camera";
import { useState, useEffect } from "react";
import { Icon } from '@/components/ui/Icon';
import { router } from 'expo-router';

export default function Permissions() {
  const [cameraPermission, setCameraPermission] = useState<CameraPermissionStatus>("not-determined");

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    const permission = await Camera.getCameraPermissionStatus();
    setCameraPermission(permission);
  };

  const togglePermission = async () => {
    if (cameraPermission === 'granted') {
      router.push('/(add)');
    } else {
      const permission = await Camera.requestCameraPermission();
      setCameraPermission(permission);
      if (permission === 'granted') {
        router.push('/(add)');
      }
    }
  };

  return (
    <ScrollView className="flex-1 bg-black px-4">
      <View className="mt-16">
        <Text className="text-white text-2xl font-bold">Camera Access</Text>
        <Text className="text-white/60 text-base mt-2">
          Enable camera access to scan book barcodes and add books instantly to your library.
        </Text>

        <TouchableOpacity 
          onPress={togglePermission}
          className="flex-row items-center justify-between mt-6 p-4 bg-white/10 rounded-xl"
        >
          <View className="flex-row items-center gap-3">
            <Icon name="camera" size={24} color="white" type="material" />
            <View>
              <Text className="text-white text-base font-semibold">Camera Access</Text>
              <Text className="text-white/60 text-sm">
                {cameraPermission === 'granted' ? 'Camera access enabled' : 'Camera access disabled'}
              </Text>
            </View>
          </View>
          <View className={`w-12 h-6 rounded-full ${cameraPermission === 'granted' ? 'bg-green-500' : 'bg-white/20'} relative`}>
            <View 
              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                cameraPermission === 'granted' ? 'right-1' : 'left-1'
              }`} 
            />
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}