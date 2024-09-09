import React, { useState, useEffect } from 'react';
import { SafeAreaView, TextInput, Button, FlatList, Text, View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import database from '@react-native-firebase/database';

const App = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch users from Firebase Realtime Database
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            const snapshot = await database().ref('/users').once('value');
            const usersData = snapshot.val() ? Object.keys(snapshot.val()).map(key => ({ id: key, ...snapshot.val()[key] })) : [];
            setUsers(usersData);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching users: ", error);
            setUsers([]);
            setIsLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (name.trim() && email.trim()) {
            try {
                const newUserRef = database().ref('/users').push();
                await newUserRef.set({
                    username: name,
                    email: email,
                    createdAt: new Date().toISOString(),
                });
                setName('');
                setEmail('');
                Alert.alert('Success', 'User added successfully!');
                fetchUsers();  // Refresh the user list after adding a new user
            } catch (error) {
                console.error("Error adding user: ", error);
                Alert.alert('Error', 'Failed to add user.');
            }
        } else {
            Alert.alert('Error', 'Please fill in all fields.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <Button title="Submit" onPress={handleSubmit} />

            {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={users}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.userItem}>
                            <Text style={styles.userText}>{item.username}</Text>
                            <Text>Email: {item.email}</Text>
                            <Text>Created At: {new Date(item.createdAt).toLocaleString()}</Text>
                        </View>
                    )}
                />
            )}
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
    userItem: {
        marginTop: 20,
        padding: 10,
        borderColor: 'gray',
        borderWidth: 1,
    },
    userText: {
        fontWeight: 'bold',
    },
});

export default App;
