import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { blurhash, fetchWithDigestAuth } from "../utils";

interface MonitorProps {
  device: string;
  username: string;
  password: string;
  channel: string;
}

export default function Monitor({
  device,
  username,
  password,
  channel,
}: MonitorProps): JSX.Element {
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    setInterval(() => {
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
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <Text>Canal {channel}</Text>

      <Image
        style={styles.image}
        source={{ uri: image ? "data:image/png;base64," + image : "" }}
        placeholder={{ blurhash: blurhash }}
        contentFit="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    padding: 10,
  },
  image: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 5,
  },
});
