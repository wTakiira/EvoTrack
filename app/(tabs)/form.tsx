import { StyleSheet, TextInput, View, Text, Image } from 'react-native';
import TimerPicker from '../../components/TimerPicker';
import { Button } from "@rneui/base"; 
import { router } from "expo-router";

export default function HomeScreen() {
    const handleTimeChange = (time: string) => {
        console.log('Time changed:', time);
    };

    return (
        <View style={styles.container}>
            <Image style={styles.images} source={require('../../assets/images/EvoTrackText.png')} />
            <Text style={styles.Text}>Nombre(s) de série(s):</Text>
            <TextInput style={styles.TextInput} keyboardType='numeric' placeholder='0' placeholderTextColor='#828282' id="serie"></TextInput>
            <Text style={styles.Text}>Nombre(s) de répétition(s):</Text>
            <TextInput style={styles.TextInput} keyboardType='numeric' placeholder='0' placeholderTextColor='#828282' id="repet"></TextInput>
            <TimerPicker label="Temps d'une rep:" onTimeChange={handleTimeChange} />
            <TimerPicker label="Temps de pause:" onTimeChange={handleTimeChange} />
            <Button
                  buttonStyle={{ width: 150, borderRadius: 8, borderWidth: 2,borderColor: "#09DEE8",backgroundColor:"#342FBD"}}
                  containerStyle={{ margin: 5, position:"absolute", bottom:30, left:"35%"}}
                  disabledTitleStyle={{ color: "#00F" }}
                  loadingProps={{ animating: true }}
                  loadingStyle={{}}
                  onPress={() => router.push('/session')}
                  title="Commencer"
                  titleProps={{}}
                  titleStyle={{ marginHorizontal: 5 }}
                />
        </View>
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
        color: "#fff",
        borderColor: "#09DEE8",
        backgroundColor:"#fff",
        borderWidth: 1,
        fontSize:28,
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
