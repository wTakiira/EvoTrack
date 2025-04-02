import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TimerPickerModal } from 'react-native-timer-picker';
import { useState } from 'react';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

interface TimerPickerProps {
    label: string;
    onTimeChange: (time: string) => void;
    initialTime?: string | null;
}

const TimerPicker: React.FC<TimerPickerProps> = ({ label, onTimeChange, initialTime }) => {
    const [showPicker, setShowPicker] = useState(false);
    const [alarmString, setAlarmString] = useState<string | null>(initialTime || null);

    const formatTime = ({ minutes, seconds }: { minutes?: number; seconds?: number }) => {
        const timeParts = [];
        if (minutes !== undefined) timeParts.push(minutes.toString().padStart(2, "0"));
        if (seconds !== undefined) timeParts.push(seconds.toString().padStart(2, "0"));
        return timeParts.join(":");
    };

    return (
        <View style={styles.timerPickerContainer}>
            <Text style={styles.infoText}>{label}</Text>
            <TouchableOpacity activeOpacity={0.7} onPress={() => setShowPicker(true)}>
                <View style={{ alignItems: 'center' }}>
                    <Text style={styles.alarmText}>{alarmString || '00:00'}</Text>
                </View>
            </TouchableOpacity>

            <TimerPickerModal
                visible={showPicker}
                setIsVisible={setShowPicker}
                onConfirm={(pickedDuration) => {
                    const formattedTime = formatTime(pickedDuration);
                    setAlarmString(formattedTime);
                    onTimeChange(formattedTime); // Pass the time back to parent component
                    setShowPicker(false);
                }}
                modalTitle="Set Alarm"
                onCancel={() => setShowPicker(false)}
                closeOnOverlayPress
                Audio={Audio}
                LinearGradient={LinearGradient}
                Haptics={Haptics}
                hideHours={true}
                repeatMinuteNumbersNTimes={1}
                repeatSecondNumbersNTimes={1}
                disableInfiniteScroll={true}
                styles={{
                    theme: 'dark',
                    confirmButton: { backgroundColor: '#09DEE8', borderColor: '#09DEE8', color: '#fff' },
                    cancelButton: { backgroundColor: 'transparent', borderColor: '#342FBD', color: '#fff' },
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    timerPickerContainer: {
        marginBottom: 30,
    },
    infoText: {
        fontSize: 18,
        color: '#fff',
        marginBottom: 10,
    },
    alarmText: {
        color: '#fff',
        fontSize: 48,
    },
});

export default TimerPicker;
