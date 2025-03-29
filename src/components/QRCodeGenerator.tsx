import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

const QRCodeGenerator: React.FC = () => {
  const [text, setText] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userString = await AsyncStorage.getItem("@user");
        console.log('Datos del context en qr:', userString);

        if (userString) {
          const storedUser = JSON.parse(userString);
          console.log('Datos luego del parse en qr:', storedUser?.data);

          if (storedUser?.data) {
            setText(storedUser.data);
            console.log('Nombre en constante local:', storedUser.data);
          }
        }
      } catch (error) {
        console.error('Error al obtener datos del AsyncStorage:', error);
      }
    };

    fetchUser();
  }, []); // Eliminamos text de las dependencias

  return (
    <View style={styles.container}>
      <View style={styles.qrContainer}>
        <QRCode value={text || 'default'} size={200} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  qrContainer: {
    marginTop: 20,
  },
});

export default QRCodeGenerator;
