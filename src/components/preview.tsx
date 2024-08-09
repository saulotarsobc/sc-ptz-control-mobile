import { Image } from "expo-image";
import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { blurhash, fetchWithDigestAuth } from "../utils";

export default function Preview({
  presetId,
  onPress,
}: {
  presetId: string;
  onPress: (presetId: string) => void;
}) {
  const [device, setDevice] = useState("http://10.0.0.123");
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("liblag.01");
  const [channel, setChannel] = useState("8");

  const [image, setImage] = useState<string | null>(null);

  const setPreset = (presetId: string) => {
    console.log("setPreset");
    fetchWithDigestAuth(
      `${device}/cgi-bin/ptz.cgi?action=start&code=SetPreset&channel=${channel}&arg1=0&arg2=${presetId}&arg3=0`,
      username,
      password
    );
  };

  const setScene = async () => {
    console.log("setScene");
    fetchWithDigestAuth(
      `${device}/cgi-bin/snapshot.cgi?channel=${channel}&type=1`,
      username,
      password
    )
      .then((response) => {
        setImage(response);
      })
      .catch((error) => {
        console.log({ error });
      });
  };

  const deleteImage = () => {
    console.log("deleteImage");
    setImage(null);
  };

  return (
    <TouchableOpacity
      style={[
        styles.TouchableOpacity,
        {
          width: useWindowDimensions().width / 2 - 20,
        },
      ]}
      activeOpacity={0.8}
      onPress={() => onPress(presetId)}
      onLongPress={() => {
        setScene();
        setPreset(presetId);
      }}
    >
      <Text style={styles.indicator}>{presetId}</Text>

      <Pressable
        style={styles.delete}
        onPress={() => {
          deleteImage();
        }}
      ></Pressable>

      <Image
        style={styles.image}
        source={{ uri: image ? "data:image/png;base64," + image : "" }}
        placeholder={{ blurhash: blurhash }}
        contentFit="cover"
        transition={400}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  TouchableOpacity: {
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: "#0553",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 80,
    aspectRatio: 16 / 9,
    position: "relative",
  },
  indicator: {
    position: "absolute",
    backgroundColor: "#fff",
    color: "#333",
    height: 20,
    width: 20,
    borderRadius: 10,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 10,
    fontWeight: "bold",
    top: 5,
    right: 5,
    zIndex: 100,
    borderColor: "#111",
    borderWidth: 1,
  },
  delete: {
    position: "absolute",
    backgroundColor: "#ff1010",
    color: "#333",
    height: 40,
    width: 40,
    borderRadius: 10,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 10,
    fontWeight: "bold",
    bottom: 5,
    right: 5,
    zIndex: 100,
    borderColor: "#111",
    borderWidth: 1,
  },
  image: {
    zIndex: 99,
    height: "100%",
    width: "100%",
  },
});
