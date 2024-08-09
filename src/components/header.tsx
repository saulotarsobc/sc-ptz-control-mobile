import { Text, View, StyleSheet } from "react-native";

interface HeaderProps {}

export default function Header({}: HeaderProps): JSX.Element {
  return (
    <View style={style.container}>
      <Text>Header</Text>
    </View>
  );
}

const style = StyleSheet.create({
  container: {},
});
