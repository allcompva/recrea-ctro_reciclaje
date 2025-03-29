import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, Dimensions, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import QRCodeGenerator from '../components/QRCodeGenerator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../context/AuthContext';

const { width } = Dimensions.get('window');
const logoAspectRatio = 1.5;
const logoWidth = width * 0.3;
const logoHeight = logoWidth / logoAspectRatio;
const buttonHeight = width * 0.15;
const qrWidth = width * 0.57;
const qrWidth2 = width;
type RootStackParamList = {
  Login: undefined;
  Main: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;
interface Props {
  navigation: LoginScreenNavigationProp;
}


const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [showComponentA, setShowComponentA] = useState(true);
  const [showComponentB, setShowComponentB] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const [nombre, setNombre] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const userString = await AsyncStorage.getItem("@user");
      console.log('datos del context en Home' + userString);
      if (userString) {
        const storedUser = JSON.parse(userString);
        console.log('datos del context luego del parse en Home' + storedUser.nombre);
        setUser(storedUser); // Configura el usuario en el contexto
        setNombre(storedUser.nombre);
        console.log('Nombre en constante local: ' + user?.nombre);
      }
    };

    fetchUser();
  }, []);
  console.log('Nombre en Home: ' + user?.nombre);
  return (

    <ImageBackground
      source={require('../assets/fondo4.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.contentContainer}>
        <Image
          source={require('../assets/logo.png')}
          style={{ width: qrWidth, height: logoHeight, marginTop: 80 }}
          resizeMode="contain"
        />
        <Text style={styles.textLabel}>{nombre}</Text>
        <Text style={styles.textLabel2}>Estado: Esperando llegada del Recolector</Text>
        {showComponentA && (
          <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <Image
              source={require('../assets/qrscanner.png')}
              style={{ width: qrWidth, }}
              resizeMode="contain"
            />
            <TouchableOpacity
              style={styles.btn}
              onPress={() => {
                setShowComponentB(true);
                setShowComponentA(false);
              }}
            >
              <Text style={{ textAlign: 'center', fontSize: 22, fontWeight: '600' }}>Generar QR</Text>
            </TouchableOpacity>
          </View>
        )}
        {showComponentB && (
          <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <QRCodeGenerator />

            <TouchableOpacity
              style={styles.btn}
              onPress={() => {
                setShowComponentB(false);
                setShowComponentA(true);
              }}
            >
              <Text style={{ textAlign: 'center', fontSize: 22, fontWeight: '600' }}>Volver</Text>
            </TouchableOpacity>
          </View>
        )}

      </View>
    </ImageBackground>
  );

};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  textLabel: {
    marginTop: 50,
    fontSize: 24,
    color: 'black',
    textAlign: 'center',
    fontWeight: '600',
  },
  textLabel2: {
    marginTop: 10,
    marginBottom: 50,
    fontSize: 20,
    color: 'black',
    textAlign: 'center',
    fontWeight: '400',
  },
  textLabel3: {
    marginTop: 5,
    fontSize: 20,
    color: 'black',
    textAlign: 'center',
    fontWeight: '400',
    marginBottom: 30,
  },
  btn: {
    marginTop: 40,
    height: buttonHeight,
    width: '80%',
    backgroundColor: '#60d07975',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;