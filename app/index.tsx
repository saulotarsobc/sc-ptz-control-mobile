import { fetchWithDigestAuth } from "@/utils";
import { useState } from "react";
import {
  Alert,
  Button,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Image } from "expo-image";
import { setStringAsync } from "expo-clipboard";

export default function Index() {
  const [device, setDevice] = useState("192.168.3.112:54669");
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("liblag.01");
  const [channel, setChannel] = useState("3");
  const [image, setImage] = useState("");
  const [msg, setMsg] = useState(0);

  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={"#333"} />
      <View style={{ height: "100%", backgroundColor: "#fff", padding: 10 }}>
        <Text style={{ marginTop: 10 }}>Device</Text>
        <TextInput
          value={device}
          onChangeText={setDevice}
          style={{
            borderColor: "black",
            borderWidth: 1,
            height: 40,
            paddingHorizontal: 10,
            borderRadius: 5,
          }}
        />

        <Text style={{ marginTop: 10 }}>Username</Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          style={{
            borderColor: "black",
            borderWidth: 1,
            height: 40,
            paddingHorizontal: 10,
            borderRadius: 5,
          }}
        />

        <Text style={{ marginTop: 10 }}>Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={{
            borderColor: "black",
            borderWidth: 1,
            height: 40,
            paddingHorizontal: 10,
            borderRadius: 5,
          }}
        />

        <Text style={{ marginTop: 10 }}>Channel</Text>
        <TextInput
          value={channel}
          onChangeText={setChannel}
          style={{
            borderColor: "black",
            borderWidth: 1,
            height: 40,
            paddingHorizontal: 10,
            borderRadius: 5,
          }}
          keyboardType="numeric"
        />

        <View style={{ marginTop: 10 }}></View>

        <Button
          title="SNAPSHOT"
          onPress={() => {
            fetchWithDigestAuth(
              `http://${device}/cgi-bin/snapshot.cgi?channel=${channel}&type=1`,
              username,
              password
            )
              .then((response) => {
                console.log("response", response.length);
                setMsg(response.length);
                setImage(response);
              })
              .catch((error: Error) => {
                console.error("Simple fetch failed:", error.message);
                Alert.alert("Error", error.message);
              });
          }}
        />

        <Text
          style={{ marginVertical: 10 }}
          onPress={() =>
            setStringAsync(
              `http://${device}/cgi-bin/snapshot.cgi?channel=${channel}&type=1`
            )
          }
        >{`http://${device}/cgi-bin/snapshot.cgi?channel=${channel}&type=1`}</Text>

        <Text>Length: {msg}</Text>

        <View style={styles.container}>
          <Image
            style={styles.image}
            source={{ uri: "data:image/png;base64," + image }}
            placeholder={{ blurhash }}
            contentFit="cover"
            transition={1000}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    flex: 1,
    width: "100%",
    backgroundColor: "#0553",
  },
});
