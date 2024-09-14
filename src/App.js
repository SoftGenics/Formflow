//src/App.js
import React, { useState, useEffect } from 'react';
import { SafeAreaView, TextInput, Button, FlatList, Text, View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import database from '@react-native-firebase/database';
import Register from './pages/Register';
import SignIn from './pages/SignIn';
import auth from '@react-native-firebase/auth';

const App = () => {
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [selectedUserId, setSelectedUserId] = useState(null); // New state to track selected user
    const [isRegistering, setIsRegistering] = useState(true);  // State to toggle between registration and user management
    const [isAuthenticated, setIsAuthenticated] = useState(false); //Check if user is authenticated.

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

    // const handleSubmit = async () => {
    //     if (name.trim() && email.trim()) {
    //         try {
    //             const newUserRef = database().ref('/users').push();
    //             await newUserRef.set({
    //                 username: name,
    //                 email: email,
    //                 createdAt: new Date().toISOString(),
    //             });
    //             setName('');
    //             setEmail('');
    //             Alert.alert('Success', 'User added successfully!');
    //             fetchUsers();  // Refresh the user list after adding a new user
    //         } catch (error) {
    //             console.error("Error adding user: ", error);
    //             Alert.alert('Error', 'Failed to add user.');
    //         }
    //     } else {
    //         Alert.alert('Error', 'Please fill in all fields.');
    //     }
    // };

    const handleSubmit = async () => {
        if (name.trim() && email.trim()) {
            try {
                if (selectedUserId) {
                    // Update existing user
                    await database().ref(`/users/${selectedUserId}`).update({
                        username: name,
                        email: email,
                        mobile: mobile,
                        updatedAt: new Date().toISOString(),
                    });
                    Alert.alert('Success', 'User updated successfully!');
                } else {
                    // Add new user
                    const newUserRef = database().ref('/users').push();
                    await newUserRef.set({
                        username: name,
                        email: email,
                        mobile: mobile,
                        createdAt: new Date().toISOString(),
                    });
                    Alert.alert('Success', 'User added successfully!');
                }

                // Reset form and selectedUserId
                setName('');
                setEmail('');
                setMobile('');
                setSelectedUserId(null);
                fetchUsers();  // Refresh the user list after adding/updating a user
            } catch (error) {
                console.error("Error adding/updating user: ", error);
                Alert.alert('Error', 'Failed to add/update user.');
            }
        } else {
            Alert.alert('Error', 'Please fill in all fields.');
        }
    };

    const handleEdit = (user) => {
        setName(user.username);
        setEmail(user.email);
        setMobile(user.mobile);
        setSelectedUserId(user.id);
    };

    // Function to delete a user by ID
    const handleDeleteUser = async (userId) => {
        try {
            await database().ref(`/users/${userId}`).remove();
            Alert.alert('Success', 'User deleted successfully!');
            fetchUsers();  // Refresh the user list after deleting a user
        } catch (error) {
            console.error("Error deleting user: ", error);
            Alert.alert('Error', 'Failed to delete user.');
        }
    };

    // Function to switch back to the main user management screen after registration
    const handleRegisterSuccess = () => {
        setIsRegistering(false);
    };

    // Function to switch to sign-in page after registration or when user clicks "Already Registered"
    const handleSwitchToSignIn = () => {
        setIsRegistering(false);
    };

    const handleSwitchToRegister = () => {
        setIsRegistering(true);
    }

    const handleSignInSuccess = () => {
        setIsAuthenticated(true);  // Switch to user management page after successful sign-in
    };

    // Handle sign-out
    const handleSignOut = async () => {
        try {
            await auth().signOut();
            Alert.alert('Success', 'Signed out successfully!');
            setIsAuthenticated(false);
        } catch (error) {
            console.error("Error signing out: ", error);
            Alert.alert('Error', 'Failed to sign out.');
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            {isRegistering ? (
                // Show Register component if the user is registering
                <Register onRegisterSuccess={handleRegisterSuccess} onAlreadyRegistered={handleSwitchToSignIn} />
            ) : !isAuthenticated ? (
                <SignIn onSignInSuccess={handleSignInSuccess} notAlreadyRegistered={handleSwitchToRegister} />
            ) : (
                <>
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
                    <TextInput
                        style={styles.input}
                        placeholder="Mobile"
                        value={mobile}
                        onChangeText={setMobile}
                    />
                    {/* <Button title="Submit" onPress={handleSubmit} /> */}
                    <Button title={selectedUserId ? "Update" : "Submit"} onPress={handleSubmit} />

                    {isLoading ? (
                        <ActivityIndicator size="large" color="#0000ff" />
                    ) : (
                        // <FlatList
                        //     data={users}
                        //     keyExtractor={item => item.id}
                        //     renderItem={({ item }) => (
                        //         <View style={styles.userItem}>
                        //             <Text style={styles.userText}>{item.username}</Text>
                        //             <Text>Email: {item.email}</Text>
                        //             <Text>Created At: {new Date(item.createdAt).toLocaleString()}</Text>
                        //         </View>
                        //     )}
                        // />
                        <FlatList
                            data={users}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => (
                                <View style={styles.userItem}>
                                    <Text style={styles.userText}>{item.username}</Text>
                                    <Text>{item.email}</Text>
                                    <Text>{item.mobile}</Text>
                                    <View style={{ paddingTop: 5 }}><Button
                                        title="Edit" onPress={() => handleEdit(item)} /></View>
                                    <View style={{ paddingTop: 5 }}>
                                        <Button title="Delete" onPress={() => handleDeleteUser(item.id)} color="red" />
                                    </View>
                                </View>
                            )}
                        />
                    )}
                    <View style={{ marginTop: 20 }}>
                        <Button title="Sign Out" onPress={handleSignOut} />
                    </View>
                </>
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
    button: {
        paddingTop: 5
    }
});



export default App;
