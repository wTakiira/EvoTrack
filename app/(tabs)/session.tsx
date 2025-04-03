import { StyleSheet, View, Text, Modal, Pressable, TouchableOpacity, TextInput } from 'react-native';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { Button } from "@rneui/base"; 
import { router, useLocalSearchParams } from 'expo-router';
import { useState,useEffect } from 'react';
import Svg, { Circle } from 'react-native-svg';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { Ionicons } from '@expo/vector-icons';




// Fonction pour convertir "MM:SS" en secondes
const convertTimeArray = (timeInput: string | string[]) => {
    const timeArray = Array.isArray(timeInput) ? timeInput : [timeInput];
    return timeArray.map(time => {
        const [minutes, seconds] = time.split(":").map(Number);
        return (minutes * 60) + seconds;
    });
};

// Fonction de gestion des sons
const PlaySound = async (soundFile) => {
    const { sound } = await Audio.Sound.createAsync(soundFile);
    await sound.playAsync(); 
}

// Fonction de textToSpeech
const speak = (text) => {
    Speech.speak(text, {
        language: 'fr',
        pitch: 1,
        rate: 1.0,
    });
};



// Fonction pour formater un nombre de secondes en "MM:SS"
const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};

export default function SessionScreen() {
    const { series, reps, repTime, restTime } = useLocalSearchParams();

    const totalSeries = Number(series) || 1;
    const totalReps = Number(reps) || 1;
    const repTimeSecArray = convertTimeArray(repTime || "00:10");
    const restTimeSecArray = convertTimeArray(restTime || "00:30");

    const [currentSeries, setCurrentSeries] = useState(1);
    const [currentRep, setCurrentRep] = useState(1);
    const [isResting, setIsResting] = useState(false);
    const [sessionFinished, setSessionFinished] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isSaving, setIsSaving] = useState(false);    


    // Récupération du bon temps pour le timer
    const currentRepTime = repTimeSecArray[Math.min(currentRep - 1, repTimeSecArray.length - 1)] || 10;
    const currentRestTime = restTimeSecArray[Math.min(currentSeries - 1, restTimeSecArray.length - 1)] || 30;

    // Gestion des couleurs
    const neonColor = isResting ? "#FF0000" : "#09DEE8"; // Rouge pour repos, Bleu pour travail

    return (
        <View style={styles.container}>
            {/* Barres obliques */}
            <View style={styles.sideBars}>
                <View style={styles.leftBar} />
                <View style={styles.rightBar} />
            </View>
            {/* Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={sessionFinished}
                onRequestClose={() => setSessionFinished(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>🎉 Séance Terminée !</Text>
                        <Button
                            buttonStyle={{ width: "100%", borderRadius: 8, borderWidth: 2,borderColor: "#000",backgroundColor:"#6e6e6e"}}
                            containerStyle={{ width: "100%",margin: 5, alignSelf:"center"}}
                            disabledTitleStyle={{ color: "#00F" }}
                            loadingProps={{ animating: true }}
                            onPress={() => setIsSaving(true)}
                            title="Sauvegarder ta séance"
                            titleStyle={{ marginHorizontal: 5 }}
                        />
                        {
                            isSaving && (
                            <View style={styles.savingView}>
                                <Text style={styles.saveText}>Entrer un nom pour la séance :</Text>
                                <TextInput style={styles.saveInput} placeholder='Nom de la séance' placeholderTextColor='#828282'></TextInput>
                                <Button
                                buttonStyle={{ width: "90%", borderRadius: 8, borderWidth: 2,borderColor: "#09DEE8",backgroundColor:"#342FBD", alignSelf:"center"}}
                                containerStyle={{ width: "100%",margin: 5, alignSelf:"center"}}
                                disabledTitleStyle={{ color: "#00F" }}
                                loadingProps={{ animating: true }}
                                onPress={() => {
                                    setIsSaving(false);
                                    setSessionFinished(false); 
                                    router.push('/form');
                                }}
                                title="Valider"
                                titleStyle={{ marginHorizontal: 5 }}
                            />
                            </View>
                            )
                        }
                        <Pressable 
                            style={styles.modalButton} 
                            onPress={() => { 
                                setSessionFinished(false); 
                                router.push('/form');
                            }}
                        >
                            <Text style={styles.modalButtonText}>Retour à l'accueil</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

             {/* Séries */}
             <View style={styles.repetitionsContainer}>
                <Text style={styles.title}>Series :</Text>
                <Text style={styles.subtitle}>{currentSeries} / {totalSeries}</Text>
            </View>

            {/* Conteneur du timer et du cercle interactif */}
            <TouchableOpacity 
                style={styles.timerContainer} 
                onPress={() => setIsPlaying(!isPlaying)}
            >
                {/* Cercle SVG avec effet néon */}
                <Svg height="200" width="200" style={{ position: "absolute" }}>
                    <Circle
                        cx="100"
                        cy="100"
                        r="80"
                        stroke="#FFF"
                        strokeWidth="10"
                        fill="transparent"
                        opacity={0.5}
                    />
                </Svg>

                {/* Timer circulaire */}
                <CountdownCircleTimer
                    isPlaying={isPlaying}
                    key={`${currentSeries}-${currentRep}-${isResting ? "rest" : "work"}`}
                    duration={isResting ? currentRestTime : currentRepTime}
                    colors={neonColor}
                    strokeWidth={8}
                    trailColor="#000F22"
                    onUpdate={(remainingTime) => {
                        if (remainingTime === 10) {
                            if (!isResting) {
                                speak("Il reste 10 secondes");
                            } else {
                                speak("On reprend dans 10 secondes");
                            }
                        }
                        switch(remainingTime) {
                            case 5:
                                speak("cinq");
                              break;   
                            case 4:
                                speak("quatre");
                              break;
                            case 3:
                                speak("trois");
                              break;
                            case 2:
                                speak("deux");
                              break;
                            case 1:
                                speak("un");
                              break;
                            default:
                              break;
                            }
                    }}
                    onComplete={() => {
                        if (isResting) {
                            PlaySound(require('../../assets/sounds/end.mp3'));
                            if (currentSeries < totalSeries) {
                                setCurrentSeries(currentSeries + 1);
                                setCurrentRep(1);
                                setIsResting(false);
                            } else {
                                PlaySound(require('../../assets/sounds/end_session.mp3'))
                                setTimeout(() => speak("Bravo, séance terminée !"), 1000);
                                setSessionFinished(true);
                            }
                        } else {
                            PlaySound(require('../../assets/sounds/end.mp3'));
                            if (currentRep < totalReps) {
                                setCurrentRep(currentRep + 1);
                            } else {
                                if (currentSeries < totalSeries) {
                                    setTimeout(() => PlaySound(require('../../assets/sounds/start_rest.wav')), 500);
                                    setTimeout(() => speak("Prenons une pause"), 1300);
                                    setIsResting(true);
                                } else {
                                    setTimeout(() => PlaySound(require('../../assets/sounds/end_session.mp3')), 500);
                                    setTimeout(() => speak("Bravo, séance terminée !"), 1000);
                                    setSessionFinished(true);
                                }
                            }
                        }
                    }}
                >
                     {({ remainingTime }) => (
                        <View style={styles.timerContent}>
                            <Ionicons 
                                name={isPlaying ? "pause" : "play"} 
                                size={30} 
                                color="#FFF" 
                                style={{ marginBottom: 5 }}
                            />
                            <Text style={styles.timerText}>{formatTime(remainingTime)}</Text>
                        </View>
                    )}
                </CountdownCircleTimer>
            </TouchableOpacity>

            {/* Répétitions */}
            <View style={styles.repetitionsContainer}>
                <Text style={styles.title}>Repetitions :</Text>
                <Text style={styles.subtitle}>{currentRep} / {totalReps}</Text>
            </View>
            {isResting && <Text style={styles.restText}>Repos !</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000F22',
        justifyContent: 'center',
        alignItems: 'center',
        position: "relative",
        gap:30,
    },
    timerContainer: {
        justifyContent: "center",
        alignItems: "center",
        width: 200,
        height: 200,
        marginBottom: 20
    },
    timerContent: {
        justifyContent: "center",
        alignItems: "center"
    },
    timerText: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#FFF",
    },
    title: {
        fontSize: 36,
        fontWeight: "bold",
        color: '#FFF',
        textAlign: 'center',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 25,
        fontWeight:"bold",
        color: '#FFF',
        textAlign: 'center',
        marginBottom: 30,
    },
    text: {
        fontSize: 18,
        color: '#FFF',
        marginTop: 20,
    },
    restText: {
        fontSize: 20,
        color: '#F7B801',
        marginTop: 10,
    },
    repetitionsContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        position:"absolute",
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        width: "90%",
        height: 400,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalButton: {
        backgroundColor: '#09DEE8',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 10,
    },
    modalButtonText: {
        fontSize: 16,
        color: '#FFF',
        fontWeight: 'bold',
    },
    sideBars: {
        position: "absolute",
        width: "100%",
        height: "100%",
    },
    leftBar: {
        position: "absolute",
        top: 400,
        left: 0,
        width: "30%",
        height: "100%",
        backgroundColor: "#2E7D7D",
        transform: [{ skewY: "-20deg" }],
    },
    rightBar: {
        position: "absolute",
        top: 400,
        right: 0,
        width: "30%",
        height: "100%",
        backgroundColor: "#2E7D7D",
        transform: [{ skewY: "20deg" }],
    },
    savingView: {
     backgroundColor:"#000F22",
     width: "100%",
     height:200,
     padding:10,
     borderRadius:12,
     gap:25,
    },
    saveText:{
     fontSize:20,
     color:"#fff",
    },
    saveInput:{
     backgroundColor: "#fff",
     color: "#000",
     fontSize:18,
     borderColor:"#09DEE8",
    }
});
