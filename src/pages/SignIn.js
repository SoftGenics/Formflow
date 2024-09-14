// src/pages/SignIn.js
import React, { useState } from 'react';
import { SafeAreaView, TextInput, Button, Alert, StyleSheet, View } from 'react-native';
import auth from '@react-native-firebase/auth';

const SignIn = ({ onSignInSuccess, notAlreadyRegistered }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignIn = async () => {
        try {
            await auth().signInWithEmailAndPassword(email, password);
            Alert.alert('Success', 'Signed in successfully!');
            onSignInSuccess();  // Notify the App component on successful login
        } catch (error) {
            console.error("Error signing in: ", error);
            Alert.alert('Error', 'Sign-in failed. Please try again.');
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
            <Button title="Sign In" onPress={handleSignIn} />
            <View style={styles.btn}>
                <Button title="Not Registered" onPress={notAlreadyRegistered} />
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

export default SignIn;
