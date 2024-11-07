import {
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "../lib/supabase";
import { Toast } from "react-native-toast-notifications";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "../providers/auth-provider";
import { Redirect } from "expo-router";
import React from "react";

const authSchema = zod.object({
  email: zod.string().email({ message: "Invalid email address" }),
  password: zod
    .string()
    .min(8, { message: "Password must be at least 8 character long" }),
});

export default function Auth() {
  const { session } = useAuth();

  if (session) return <Redirect href={"/"} />;

  const { control, handleSubmit, formState } = useForm({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signIn = async (data: zod.infer<typeof authSchema>) => {
    const { error } = await supabase.auth.signInWithPassword(data);
    if (error) {
      Toast.show(`${error.message}`, {
        type: "danger", // Use 'danger' for error indication
        placement: "top", // Position it at the top for higher visibility
        duration: 2000, // Increase duration to keep it visible longer
        animationType: "slide-in", // Use slide-in for more alert-like animation
        style: {
          backgroundColor: "#cc0000", // Red background for error
          padding: 15,
          borderWidth: 1,
          borderColor: "#990000",
          borderRadius: 8,
          marginTop: 80,
          minWidth: "90%", // Make it bigger for alert-style visibility
          maxWidth: "90%",
          alignSelf: "center",
        },
        textStyle: {
          color: "#ffffff", // White text for contrast
          fontSize: 18,
          fontWeight: "bold",
          letterSpacing: 1.2,
        },
        icon: <Feather name="alert-circle" size={28} color="#ffffff" />, // Alert icon for clarity
      });
    } else {
      Toast.show("Signed in Successfully", {
        type: "success",
        placement: "bottom",
        duration: 1000,
        animationType: "zoom-in",
        style: {
          backgroundColor: "#333333", // Dark background
          padding: 10,
          borderWidth: 1,
          borderColor: "#555555",
          borderRadius: 6,
          marginBottom: 100,
        },
        textStyle: {
          color: "#ffffff", // White text to match button
          fontSize: 16,
          fontWeight: "bold",
          letterSpacing: 1,
        },
        icon: <Feather name="smile" size={24} color="#ffffff" />,
      });
    }
  };

  const signUp = async (data: zod.infer<typeof authSchema>) => {
    const { error } = await supabase.auth.signUp(data);
    if (error) {
      alert(error.message);
    } else {
      Toast.show("Signed Up Successfully", {
        type: "success",
        placement: "bottom",
        duration: 1000,
        animationType: "zoom-in",
        style: {
          backgroundColor: "#333333", // Dark background
          padding: 10,
          borderWidth: 1,
          borderColor: "#555555",
          borderRadius: 6,
          marginBottom: 100,
        },
        textStyle: {
          color: "#ffffff", // White text to match button
          fontSize: 16,
          fontWeight: "bold",
          letterSpacing: 1,
        },
        icon: <Feather name="star" size={24} color="#FFD700" />,
      });
    }
  };
  return (
    <ImageBackground
      source={{
        uri: "https://images.pexels.com/photos/6686455/pexels-photo-6686455.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      }}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay} />
      <View style={styles.container}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>please signIn to continue</Text>

        <Controller
          control={control}
          name="email"
          render={({
            field: { value, onChange, onBlur },
            fieldState: { error },
          }) => (
            <React.Fragment>
              <TextInput
                placeholder="Email"
                style={styles.input}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholderTextColor="#aaa"
                autoCapitalize="none"
                editable={!formState.isSubmitting}
              />
              {error && <Text style={styles.error}>{error.message}</Text>}
            </React.Fragment>
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({
            field: { value, onChange, onBlur },
            fieldState: { error },
          }) => (
            <>
              <TextInput
                placeholder="Password"
                style={styles.input}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholderTextColor="#aaa"
                autoCapitalize="none"
                secureTextEntry
                editable={!formState.isSubmitting}
              />
              {error && <Text style={styles.error}>{error.message}</Text>}
            </>
          )}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit(signIn)}
          disabled={formState.isSubmitting}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.signUpButton]}
          onPress={handleSubmit(signUp)}
          disabled={formState.isSubmitting}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  container: {
    fontFamily: "Inter_900Black",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    width: "100%",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#ddd",
    marginBottom: 32,
  },
  input: {
    width: "90%",
    padding: 12,
    marginBottom: 16,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 8,
    fontSize: 16,
    color: "#000",
  },
  button: {
    backgroundColor: "#0e0b0b",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    width: "90%",
    borderColor: "white",
    borderWidth: 1,
    alignItems: "center",
  },
  signUpButton: {
    backgroundColor: "transparent",
    borderColor: "#fff",
    borderWidth: 1,
  },
  signUpButtonText: {
    color: "#fff",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  error: {
    color: "red",
    fontSize: 12,
    marginBottom: 16,
    textAlign: "left",
    width: "90%",
  },
});
