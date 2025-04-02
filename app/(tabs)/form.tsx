import { StyleSheet, View } from 'react-native';
import TimerPicker from '../../components/TimerPicker'; // Importer le composant TimerPicker

export default function HomeScreen() {
    const handleTimeChange = (time: string) => {
        console.log('Time changed:', time);
    };

    return (
        <View style={styles.container}>
            <TimerPicker label="Temps d'un rep:" onTimeChange={handleTimeChange} />
            <TimerPicker label="Temps de pause:" onTimeChange={handleTimeChange} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000F22',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
