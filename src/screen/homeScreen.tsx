import React, { useEffect, useState, useCallback } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import PlusIcon from "../assets/UI/Add.svg";

import i18n from "../services/i18n";
import { db } from "../services/orm";
import { User } from "../entities";
import { CustomButton } from "../components/Button";
import { TouchableOpacity, ScrollView } from "react-native-gesture-handler";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../services/navigation/routeTypes";
import { useFocusEffect } from '@react-navigation/native';

type HomeNavigationProps = StackNavigationProp<RootStackParamList, "Home">;
type Props = {
  navigation: HomeNavigationProps;
};
export const HomeScreen = ({ navigation }: Props) => {
  const [userList, setUsers] = useState<User[] | undefined>();

  const loadUsers = async () => {
    const connection = await db;
    const users = await connection.getRepository(User).find({});
    setUsers(users);
  };

  const goToCreate = () => {
    navigation.navigate("ProfileAdd");
  };

  const goToAbout = () => {
    navigation.navigate("About");
  };

  const goToResources = () => {
    navigation.navigate("Resources");
  };

  const goToUser = (user: User) => {
    return () => {
      navigation.navigate("Profile", { user })
    };
  };

  const editUser = (user: User) => async () => {
    navigation.navigate('ProfileAdd', { user })
  };
 
  useEffect(() => {
    navigation.addListener('focus', loadUsers);
		return () => {
			navigation.removeListener('focus', loadUsers)
		}
  }, []);

  return userList ? (
    <View style={styles.container}>
      {userList.length === 0 ? (
        <View style={styles.container}>
          <Image
            source={require("../assets/home-image.png")}
            style={{ width: 250, height: 250, maxWidth: "100%" }}
          />
          <CustomButton
            onPress={goToCreate}
            text={i18n.t("create-user")}
            containerStyle={{
              width: "100%",
              paddingLeft: 40,
              paddingRight: 40,
            }}
          />
        </View>
      ) : (
        <ScrollView
          style={{ width: "100%", marginVertical: 20 }}
          centerContent={true}
          contentContainerStyle={styles.containerScroll}
        >
          <View style={{ width: "100%", padding: 30 }}>
            {userList.map((user) => (
              <CustomButton
                onLongPress={editUser(user)}
                key={user.id}
                onPress={goToUser(user)}
                text={user.name}
                style={{ paddingTop: 25, paddingBottom: 25, borderRadius: 25 }}
                containerStyle={{ width: "100%", marginBottom: 10 }}
              />
            ))}
          </View>
          <TouchableOpacity onPress={goToCreate}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <PlusIcon width={30} height={30} />
              <Text
                style={{
                  fontFamily: 'OpenSans-Bold',
                  color: "#457B9D",
                  textTransform: "uppercase",
                  letterSpacing: 1.36,
                  marginLeft: 10,
                }}
              >
                {i18n.t("add-user")}
              </Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      )}
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <CustomButton
          style={styles.buttonTabText}
          containerStyle={styles.buttonTab}
          onPress={goToResources}
          text={i18n.t("resources")}
        />
        <CustomButton
          style={styles.buttonTabText}
          containerStyle={styles.buttonTab}
          onPress={goToAbout}
          text={i18n.t("about")}
        />
      </View>
    </View>
  ) : (
    <Text>...</Text>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  containerScroll: {
    width: "100%",
    alignItems: "center",
    minHeight: "80%",
    justifyContent: "center",
  },
  buttonTab: {
    width: "auto",
    paddingLeft: 30,
    paddingRight: 30,
    marginBottom: 10,
  },
  buttonTabText: {
    backgroundColor: "rgba(255,255,255,0)",
    color: "#457B9D",
    fontFamily: 'OpenSans-SemiBold',
    textTransform: "uppercase",
    fontSize: 16,
    letterSpacing: 1.36
  },
});
