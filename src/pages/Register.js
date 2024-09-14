//src/pages/Register.js
import React, { useState } from 'react';
import { SafeAreaView, TextInput, Button, Alert, StyleSheet, View, Text } from 'react-native';
import auth from '@react-native-firebase/auth';
//For Authentication install these dependencies
//npm install @react-native-firebase/app @react-native-firebase/auth
import SignIn from './SignIn';

//User Registration Method
const Register = ({ onRegisterSuccess, onAlreadyRegistered }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // New state for confirm password

    const handleRegister = async () => {
        // Validate if passwords match
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match. Please try again.');
            return;
        }

        try {
            await auth().createUserWithEmailAndPassword(email, password);
            Alert.alert('Success', 'User registered successfully!');
            onRegisterSuccess(); // Notify the App component to switch back after registration
        } catch (error) {
            Alert.alert('Error', 'Registration failed.' `${error}`);
            console.error("Error registering user: ", error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                secureTextEntry
                value={confirmPassword}  // Second input for confirm password
                onChangeText={setConfirmPassword}
            />

            <Button style={styles.btn} title="Register" onPress={handleRegister} />
            <View style={styles.btn}>
                <Button title="Already Registered" onPress={onAlreadyRegistered} />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    btn: {
        padding: 10,
        marginBottom: 20,
    }
});

export default Register;
