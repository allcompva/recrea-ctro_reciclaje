import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ImageBackground, TextInput, Button, Image, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext } from '../context/AuthContext';


const { width } = Dimensions.get('window');
const logoAspectRatio = 1.5;
const logoWidth = width * 0.3;
const logoHeight = logoWidth / logoAspectRatio;
const buttonHeight = width * 0.15;


type RootStackParamList = {
  Main: undefined;
  Login: undefined;

};

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;
interface Props {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { user, setUser } = useContext(UserContext);


  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Por favor, ingrese nombre de usuario y contraseña");
      return;
    }
    console.log(username);
    console.log(password);
    try {
      const response = await fetch(`https://recreas.net/BackEnd/Centro_reciclado/Login?cuit=${username}&pass=${password}`, {
        method: "GET",
      });

      const data = await response.json();
      await AsyncStorage.setItem("@user", JSON.stringify(data));
      console.log(data);
      console.log('Nombre:', JSON.parse(JSON.stringify(data))?.nombre);
      console.log('Data: ', JSON.parse(JSON.stringify(data))?.data);
      if (JSON.parse(JSON.stringify(data))?.nombre == null || JSON.parse(JSON.stringify(data))?.nombre == undefined) {
        setUser(null);
        alert('Usuario o contraseña incorecto');
      }
      else{
        setUser(data);        
        navigation.navigate("Main");
      }

    } catch (error) {
      const err = error as Error;
      Alert.alert("Error", err.message);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/fondo2.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.contentContainer}>
        <Text style={{ fontSize: 30, fontWeight: 700, marginTop: 30, marginBottom:15 }}>Iniciar Sesión</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre de usuario"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={styles.btn}
          onPress={handleLogin}
        >
          <Text style={{ textAlign: 'center', fontSize: 22, fontWeight: '600' }}>Ingresar</Text>
        </TouchableOpacity>
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  input: {
    width: '80%',
    padding: 10,
    height: 60,
    marginBottom: 20,
    fontSize: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
    backgroundColor: 'white',
  },
  btn: {
    marginTop: 40,
    height: buttonHeight,
    width: '80%',
    backgroundColor: '#60d07975',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default LoginScreen;

