import React, { useEffect, useState } from 'react';
import { View, Image, Text, Button, FlatList, StyleSheet, ActivityIndicator, Platform, Dimensions, ImageBackground, TouchableOpacity }
  from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Localization from "expo-localization";
import { Ionicons } from "@expo/vector-icons"; // Ionicons ya viene con Expo

interface Detalle {
  material: string;
  cantidad_recolectada: number;
}
const { width } = Dimensions.get('window');
const logoAspectRatio = 1.5;
const logoWidth = width * 0.3;
const logoHeight = logoWidth / logoAspectRatio;
const buttonHeight = width * 0.15;


interface Detalle {
  material: string;
  cantidad_recolectada: number;
}

interface Recoleccion {
  fecha: string;
  lote: number;
  recolector: string;
  domicilio_recorridos: number;
  total_Recolecciones: number;
  lstDetalle: Detalle[];
}
const API_BASE_URL = "https://recreas.net/BackEnd/Informe/InfDistGeneral";

const InfoSceen: React.FC = () => {
  const [desde, setDesde] = useState<Date | null>(null);
  const [hasta, setHasta] = useState<Date | null>(null);
  const [showDesde, setShowDesde] = useState(false);
  const [showHasta, setShowHasta] = useState(false);
  const [data, setData] = useState<Recoleccion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  // 🔹 Aquí colocamos el useEffect() para inicializar las fechas
  useEffect(() => {
    setDesde(new Date());
    setHasta(new Date());
  }, []);

  const formatoFechaCorta = (fecha: Date | null) => {
    return fecha ? fecha.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" }) : 
    new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
  };
  
  // Mostrar picker de fecha "Desde"
  const showDatePickerDesde = () => setShowDesde(true);

  // Mostrar picker de fecha "Hasta"
  const showDatePickerHasta = () => setShowHasta(true);

  // Cargar datos del servidor con las fechas seleccionadas
  const fetchData = async () => {
    if (!desde || !hasta) {
      alert("Por favor selecciona ambas fechas");
      return;
    }

    setLoading(true);
    try {
      const desdeStr = desde.toISOString().split("T")[0]; // Formato YYYY-MM-DD
      const hastaStr = hasta.toISOString().split("T")[0];

      const url = `${API_BASE_URL}?desde=${desdeStr}&hasta=${hastaStr}`;
      console.log("URL de consulta:", url);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Error al obtener los datos");
      }

      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un error al obtener los datos.");
    } finally {
      setLoading(false);
    }
  };

  return (

    <ImageBackground
      source={require('../assets/fondo4.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 80, }}>
        <Image
          source={require('../assets/logo.png')}
          style={{ width: logoWidth, height: logoHeight }}
          resizeMode="contain"
        />
      </View>


      <View style={styles.container}>
        <View style={styles.row}>
          <View style={[styles.column]} >
            <Text style={styles.label}>Desde</Text>
            <TouchableOpacity
              style={{
                backgroundColor: 'white', display: 'flex', flexDirection: "row", borderStyle: 'solid',
                borderColor: 'darkcyan', borderWidth: 2, borderTopLeftRadius: 15, 
                borderBottomLeftRadius: 15
              }}
              onPress={showDatePickerDesde}
            >
              <Ionicons name="calendar-outline" size={24} color="darkcyan" style={{ marginLeft: 5, marginTop: 5 }} />
              <Text style={{ padding: 8, width: '100%', textAlign: 'left', fontSize: 14, fontWeight: '600', display: 'flex' }}>{formatoFechaCorta(desde)}</Text>
            </TouchableOpacity>
            {showDesde && (
              <DateTimePicker
                value={desde || new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(event, selectedDate) => {
                  setShowDesde(false);
                  if (selectedDate) setDesde(selectedDate);
                }}
              />
            )}
          </View>
          <View style={[styles.column]} >
            <Text style={styles.label}>Hasta</Text>
            <TouchableOpacity
              style={{
                backgroundColor: 'white', display: 'flex', flexDirection: "row", borderStyle: 'solid',
                borderColor: 'darkcyan', borderWidth: 2, borderRadius: 0
              }}
              onPress={showDatePickerHasta}
            >
              <Ionicons name="calendar-outline" size={24} color="darkcyan" style={{ marginLeft: 5, marginTop: 5 }} />
              <Text style={{
                padding: 8, width: '100%', textAlign: 'left', fontSize: 14, fontWeight: '600',
                display: 'flex'
              }}>{formatoFechaCorta(hasta)}</Text>
            </TouchableOpacity>
            {showHasta && (
              <DateTimePicker
                value={hasta || new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(event, selectedDate) => {
                  setShowHasta(false);
                  if (selectedDate) setHasta(selectedDate);
                }}
              />
            )}
          </View>
          <View style={styles.botonBuscar}>
            <TouchableOpacity style={{backgroundColor:'white'}} onPress={fetchData}>
              <Ionicons name="search" size={18} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        {loading && <ActivityIndicator size="large" color="#007bff" />}
        <FlatList
          data={data}
          keyExtractor={(item) => item.lote.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.header}>Lote {item.lote}</Text>
              <Text>Fecha: {new Date(item.fecha).toLocaleString()}</Text>
              <Text>Recolector: {item.recolector}</Text>
              <Text>Dom. Recorridos: {item.domicilio_recorridos}</Text>
              <Text>Total Recolecciones: {item.total_Recolecciones}</Text>

              <Text style={styles.subHeader}>Detalles:</Text>
              <FlatList
                data={item.lstDetalle}
                keyExtractor={(detail, index) => index.toString()}
                renderItem={({ item: detail }) => (
                  <Text style={styles.detailItem}>
                    {detail.material}: {detail.cantidad_recolectada}
                  </Text>
                )}
              />
            </View>
          )}
        />
      </View>
    </ImageBackground>

  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    textAlign: 'center'
  },
  label: {
    fontSize: 16,
    fontWeight: "400",
    marginTop: 10,
    textAlign: 'left',
    marginBottom: 5
  },
  container: {
    textAlign: 'left',
    flex: 1,
    padding: 0,
    backgroundColor: 'transparent !important',
    paddingTop: 10
  },
  row: {
    flexDirection: "row", // Alinear en fila (tres columnas)
    justifyContent: "space-between", // Espaciado uniforme
    alignItems: "flex-end",
    marginBottom: 10,
    width: '100%',
    paddingHorizontal: 15
  },
  column: {
    flex: 2, // 60% del espacio (relativo)
    width: '60%',
    alignItems: "flex-start",
    justifyContent: "flex-start",
    backgroundColor: "white",
    borderRadius: 5,
  },
  fechaTexto: {
    fontSize: 16,
    fontWeight: "bold",
  },
  botonBuscar: {
    flex: 1, // 20% del espacio
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderStyle:'solid',
    borderColor:'darkcyan',
    borderWidth:2,
    padding: 8,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15
  },
  labelInvisible: {
    fontSize: 14,
    fontWeight: "bold",
    opacity: 0, // Oculta el texto pero mantiene el espacio
  },
  card: {

    padding: 15,
    marginVertical: 8,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: 'white',
    margin: 25
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  detailItem: {
    fontSize: 14,
    marginLeft: 10,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default InfoSceen;
