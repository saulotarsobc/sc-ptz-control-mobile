import { useState } from "react";
import { SafeAreaView, ScrollView, StatusBar, View } from "react-native";
import { fetchWithDigestAuth } from "../utils";
import Preview from "../components/preview";
import Monitor from "../components/monitor";

export default function Index() {
  const [device, setDevice] = useState("http://10.0.0.123");
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("liblag.01");
  const [channel, setChannel] = useState("8");

  const handleChangeScene = async (scene: string) => {
    console.log({ handleChangeScene: scene });
    fetchWithDigestAuth(
      `${device}/cgi-bin/ptz.cgi?action=start&code=GotoPreset&channel=${channel}&arg1=0&arg2=${scene}&arg3=0`,
      username,
      password
    )
      .then((response) => {
        console.log({ response });
      })
      .catch((error) => {
        console.log({ error });
      });
  };

  const handleDeletePhoto = async (scene: number) => {
    console.log({ handleDeletePhoto: scene });
  };

  return (
    <SafeAreaView>
      <StatusBar barStyle="light-content" backgroundColor={"#333"} />

      <View style={{ height: "100%", backgroundColor: "#fff", padding: 10 }}>
        <Monitor
          device={device}
          username={username}
          password={password}
          channel={channel}
        />

        <ScrollView showsHorizontalScrollIndicator={true}>
          <View
            id="grid"
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            {Array.from({ length: 24 }, (_, i) => (
              <Preview
                key={i}
                presetId={String(i + 1)}
                onPress={(presetId) => handleChangeScene(presetId)}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
