import { Alert, Button, ScrollView, Text, View } from "react-native";
import {
  GoogleSignin,
  GoogleSigninButton,
  isErrorWithCode,
  isNoSavedCredentialFoundResponse,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { useState } from "react";

GoogleSignin.configure({
  "webClientId":"424039843806-qo0tn5t4hqqktlsr3tucq34jo9a0rghs.apps.googleusercontent.com",
  "iosClientId":"424039843806-71gaim4tsm3g7pf93jmjahsb2rjai2q9.apps.googleusercontent.com"
});

export default function Index() {
  const [userInfo, setUserInfo] = useState<any>(null);

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      console.log("Google Sign-In Response:", JSON.stringify(response, null, 2));
      if (isSuccessResponse(response)) {
        setUserInfo(response.data);
      } else {
        console.log('Sign in was cancelled by user');   
      }
    } catch (error) { 
      if (isErrorWithCode(error)) {
      switch (error.code) {
        case statusCodes.IN_PROGRESS:
          Alert.alert("Sign in is in progress");
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          Alert.alert("Play services not available");
          // Android only, play services not available or outdated
          break;
        default:
        // some other error happened
      }
    } else {
      Alert.alert("An error that's not related to google sign in occurred");
      // an error that's not related to google sign in occurred
    }
    }
  }

  const getCurrentUser = async () => {
    try {
      const response = await GoogleSignin.signInSilently();
      if (isSuccessResponse(response)) {
        console.log("Current User:", response.data);
        setUserInfo(response.data);
        Alert.alert("Success", "User data refreshed successfully!");
      } else if (isNoSavedCredentialFoundResponse(response)) {
        Alert.alert("No user", "No saved credentials found");
      }
    } catch (error) {
      console.error("Get User Error:", error);
      Alert.alert("Error", "Failed to fetch current user");
    }
  }

  const handleGoogleSignOut = async () => {
    try {
      await GoogleSignin.signOut();
      setUserInfo(null); // Remove user info
      Alert.alert("Logged out", "You have been logged out successfully.");
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Error", "Failed to log out.");
    }
  }
  
  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <Text>Sign in with Google:</Text>
      {
        userInfo ? (
          <View>
            <Button title="Sign Out" onPress={handleGoogleSignOut} />
            <Button title="Get Current User" onPress={getCurrentUser} />
            <Text>{JSON.stringify(userInfo, null, 2)}</Text>
          </View>
        ) : (
          <GoogleSigninButton
            style={{ width: 212, height: 48 }}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={handleGoogleSignIn}
          />
        )
      }
    </ScrollView>
  );
}
