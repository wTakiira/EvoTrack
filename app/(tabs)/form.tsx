import { StyleSheet, TextInput, View, Text, Image, ScrollView } from 'react-native';
import TimerPicker from '../../components/TimerPicker';
import { Button } from "@rneui/base"; 
import { router } from "expo-router";
import { useState,useEffect } from 'react';
import { Keyboard } from 'react-native';


export default function HomeScreen() {
    const [series, setSeries] = useState('');
    const [reps, setReps] = useState('');
    const [repTime, setRepTime] = useState('00:00');
    const [restTime, setRestTime] = useState('00:00');


    const handleStartSession = () => {
        router.push({
            pathname: "/session",
            params: {
                series,
                reps,
                repTime,
                restTime
            }
        });
    };

    return (
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <Image style={styles.images} source={require('../../assets/images/EvoTrackText.png')} />
            <Text style={styles.Text}>Nombre(s) de série(s):</Text>
            <TextInput style={styles.TextInput} keyboardType='numeric' placeholder='0' placeholderTextColor='#828282' value={series} onChangeText={setSeries}></TextInput>
            <Text style={styles.Text}>Nombre(s) de répétition(s):</Text>
            <TextInput style={styles.TextInput} keyboardType='numeric' placeholder='0' placeholderTextColor='#828282' value={reps} onChangeText={setReps}></TextInput>
            <TimerPicker label="Temps d'une rep:" onTimeChange={setRepTime} onPress={() => Keyboard.dismiss()}/>
            <TimerPicker label="Temps de pause:" onTimeChange={setRestTime} onPress={() => Keyboard.dismiss()}/>
            <Button
                  buttonStyle={{ width: "100%", borderRadius: 8, borderWidth: 2,borderColor: "#09DEE8",backgroundColor:"#342FBD"}}
                  containerStyle={{ width: "100%",margin: 5, alignSelf:"center"}}
                  disabledTitleStyle={{ color: "#00F" }}
                  loadingProps={{ animating: true }}
                  loadingStyle={{}}
                  onPress={handleStartSession}
                  title="Commencer"
                  titleProps={{}}
                  titleStyle={{ marginHorizontal: 5 }}
                />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000F22',
        padding:"10%",
        justifyContent: 'center',
    },
    TextInput: {
        color: "#000",
        borderColor: "#09DEE8",
        backgroundColor:"#fff",
        borderWidth: 1,
        fontSize:30,
        textAlign:"center",
        width:300,
        height:60,
        marginBottom:30,
        marginTop:10,
    },
    Text: {
        color:"#fff",
        fontSize:20,
    },
    images: {
        width: "100%",
        height: 50,
        marginBottom:60,
    }
});
