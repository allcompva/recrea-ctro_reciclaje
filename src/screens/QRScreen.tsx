import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, Dimensions, ScrollView, ActivityIndicator } from 'react-native';
import { VictoryPie, VictoryBar, VictoryChart, VictoryAxis, VictoryLabel, VictoryLegend } from 'victory-native';

// 🔹 Interfaces para los datos de la API

interface Material {
    tipo_reciclaje: number;
    material: string;
    porcentaje: number;
}

interface RecoleccionMensual {
    mes: string;
    recolecciones: number;
}
/*
interface Recolector {
  Recolector: string;
  Recolecciones: number;
}*/

// 🔹 URLs de las APIs
const API_MATERIALES = "https://recreas.net/BackEnd/Informe/InfDistMateriales";
const API_MENSUAL = "https://recreas.net/BackEnd/Informe/InfRecoleccionesMes";
/*const API_RECOLECTORES = "https://recreas.net/BackEnd/Informe/RankingRecolectores";*/

const { width } = Dimensions.get('window');
const logoAspectRatio = 1.5;
const logoWidth = width * 0.3;
const logoHeight = logoWidth / logoAspectRatio;
const qrWidth = width * 0.57;

const Dashboard: React.FC = () => {
    const [dataMateriales, setDataMateriales] = useState<Material[]>([]);
    const [dataMensual, setDataMensual] = useState<RecoleccionMensual[]>([]);
    /*const [dataRecolectores, setDataRecolectores] = useState<Recolector[]>([]);*/
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {

                const response = await fetch(API_MATERIALES);
                if (!response.ok) {
                    throw new Error("Error");
                }

                const jsonData = await response.json();
                setDataMateriales(jsonData);

            } catch (error) {
                console.error("Error al obtener datos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);
    useEffect(() => {
        const fetchData = async () => {
            try {

                const response2 = await fetch(API_MENSUAL);
                if (!response2.ok) {
                    console.log(response2);
                    throw new Error("Error");
                }

                const jsonData2 = await response2.json();
                console.log(jsonData2);
                setDataMensual(jsonData2);

            } catch (error) {
                console.error("Error al obtener datos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);
    const colors = ["#4ECDC4", "#C7C7C7", "#FFD700", "#0072BB", "#E63946", "#000000"];

    return (
        <ImageBackground source={require('../assets/fondo4.png')} style={styles.background} resizeMode="cover">
            <View style={styles.contentContainer}>
                <Image source={require('../assets/logo.png')} style={{ width: qrWidth, height: logoHeight, marginTop: 80 }} resizeMode="contain" />
            </View>
            <ScrollView style={styles.container}>
                {loading ? (
                    <ActivityIndicator size="large" color="#007bff" />
                ) : (
                    <>
                        <View style={[styles.chartContainer, { minHeight: 500, paddingBottom: 0 }]}>
                            <Text style={styles.chartTitle}>Distribución de Materiales</Text>
                            <VictoryPie
                                data={dataMateriales.map((item) => ({ x: item.material, y: item.porcentaje.toFixed(2) }))}
                                colorScale={['gray', 'lightgray', 'yellow', 'blue', 'brown', 'darkcyan']}
                                innerRadius={60}
                                width={330}
                                height={280}
                                labels={() => ""}
                            />
                            <VictoryLegend
                                x={50}
                                y={5}
                                orientation="vertical"
                                gutter={20}
                                data={dataMateriales.map((item, index) => ({
                                    name: `${item.material}: ${item.porcentaje.toFixed(2)}%`,
                                    symbol: { fill: colors[index] },
                                }))}
                            />
                        </View>
                        <View style={[styles.chartContainer, { minHeight: 350, paddingBottom: 0 }]}>
                            <Text style={styles.chartTitle}>Recolecciones Mensuales</Text>
                            <VictoryChart height={250} domainPadding={20} padding={{ top: 20, bottom: 80, left: 50, right: 50 }}>
                                <VictoryAxis height={200}
                                    style={{
                                        axis: { stroke: '#ccc' },
                                        tickLabels: { fontSize: 12, padding: 5, fill: '#333' },
                                    }}
                                    tickLabelComponent={
                                        <VictoryLabel angle={-90} textAnchor="end" dx={-8} verticalAnchor={'middle'}
                                        />}
                                    axisLabelComponent={<VictoryLabel x={10} />}
                                />
                                <VictoryBar
                                    data={dataMensual.map((item) => ({ x: item.mes, y: item.recolecciones }))}
                                    x="x"
                                    y="y"
                                    style={{ data: { fill: "green", width: 20 } }}
                                    labels={({ datum }) => datum.y} 
                                    labelComponent={<VictoryLabel dy={-10} />}
                                />
                            </VictoryChart>
                        </View>
                    </>
                )}
            </ScrollView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        paddingBottom: 15,
    },
    contentContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        padding: 16,
        paddingBottom: 100,
    },
    title: {
        marginTop: 0,
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 16,
        color: '#333',
        marginBottom: 20,
    },
    chartContainer: {
        marginBottom: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        paddingBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginHorizontal: 15,
        alignContent: 'center',
        alignItems: 'center',

    },
    chartTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 25,
        marginBottom: 0,
        color: '#444',
        textAlign: 'center',
    },
});

export default Dashboard;
