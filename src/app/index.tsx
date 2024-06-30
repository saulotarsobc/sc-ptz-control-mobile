import { useState } from "react";
import {
  Alert,
  Button,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";
import { setStringAsync, setImageAsync } from "expo-clipboard";
import * as Crypto from "expo-crypto";

export default function Index() {
  const [device, setDevice] = useState(
    "https://8ead-168-0-83-148.ngrok-free.app"
  );
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("liblag.01");
  const [channel, setChannel] = useState("3");
  const [image, setImage] = useState("");
  const [msg, setMsg] = useState(0);

  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

  /**
   * Calculates the MD5 hash of the given string using the Expo Crypto module.
   *
   * @param {string} str - The string to calculate the MD5 hash for.
   * @return {Promise<string>} A promise that resolves to the MD5 hash of the string.
   */
  const md5 = async (str: string): Promise<string> => {
    return await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.MD5,
      str
    );
  };

  async function fetchWithDigestAuth(
    url: string,
    username: string,
    password: string
  ): Promise<string> {
    const authHeader = (
      method: any,
      uri: any,
      nonce: any,
      realm: any,
      qop: any,
      nc: any,
      cnonce: any,
      response: any
    ): string => {
      return `Digest username="${username}", realm="${realm}", nonce="${nonce}", uri="${uri}", qop=${qop}, nc=${nc}, cnonce="${cnonce}", response="${response}"`;
    };

    /**
     * Calculates the Digest Response for Digest Authentication.
     *
     * @param {any} nonce - The nonce value from the server.
     * @param {any} realm - The realm value from the server.
     * @param {any} qop - The qop value from the server.
     * @param {any} method - The HTTP method of the request.
     * @param {any} uri - The URI of the request.
     * @param {any} nc - The nonce count value.
     * @param {any} cnonce - The client nonce value.
     * @return {Promise<string>} A promise that resolves to the digest response.
     */
    const makeDigestResponse = async (
      nonce: any,
      realm: any,
      qop: any,
      method: any,
      uri: any,
      nc: any,
      cnonce: any
    ): Promise<string> => {
      const ha1 = await md5(`${username}:${realm}:${password}`);
      const ha2 = await md5(`${method}:${uri}`);
      return await md5(`${ha1}:${nonce}:${nc}:${cnonce}:${qop}:${ha2}`);
    };

    const initialResponse = await fetch(url);
    if (!initialResponse.headers.has("www-authenticate")) {
      throw new Error("No www-authenticate header in the response");
    }

    const authHeaderStr: any = initialResponse.headers.get("www-authenticate");
    const authParams = authHeaderStr
      .substring(7)
      .split(", ")
      .reduce((acc: any, current: any) => {
        const [key, value] = current.split("=");
        acc[key] = value.replace(/"/g, "");
        return acc;
      }, {});

    const method = "GET";
    const uri = url.replace(/^.*\/\/[^\/]+/, ""); // Extrai o URI do URL
    const nonce = authParams["nonce"];
    const realm = authParams["realm"];
    const qop = "auth";
    const nc = "00000001";
    const cnonce = Math.random().toString(36).substring(2, 15);

    const responseHash = await makeDigestResponse(
      nonce,
      realm,
      qop,
      method,
      uri,
      nc,
      cnonce
    );
    const authorization = authHeader(
      method,
      uri,
      nonce,
      realm,
      qop,
      nc,
      cnonce,
      responseHash
    );

    const finalResponse = await fetch(url, {
      headers: {
        Authorization: authorization,
      },
    });

    if (!finalResponse.ok) {
      throw new Error(`HTTP error! status: ${finalResponse.status}`);
    }

    const buffer = await finalResponse.arrayBuffer();
    const base64String = btoa(String.fromCharCode(...new Uint8Array(buffer)));
    return base64String;
  }

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
              `${device}/cgi-bin/snapshot.cgi?channel=${channel}&type=1`,
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
              `${device}/cgi-bin/snapshot.cgi?channel=${channel}&type=1`
            )
          }
        >{`${device}/cgi-bin/snapshot.cgi?channel=${channel}&type=1`}</Text>

        <Text>Length: {msg}</Text>

        <TouchableOpacity
          style={styles.container}
          activeOpacity={0.8}
          onLongPress={() =>
            setImageAsync(image)
              .then(() => Alert.alert("Image on clipboard"))
              .catch(() => {})
          }
        >
          <Image
            style={styles.image}
            source={{ uri: "data:image/png;base64," + image }}
            placeholder={{ blurhash }}
            contentFit="cover"
            transition={1000}
          />
        </TouchableOpacity>
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
