import {HeaderProps} from '@/utils/type';

import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather, Entypo } from "@expo/vector-icons";
import { Menu, Provider } from "react-native-paper";
import { useRouter } from "expo-router";
import RenameModal from "./rename-modal"; 

const HeaderWithMenu = ({
  name,
  visible,
  openMenu,
  closeMenu,
  onRename,
  onDelete,
}: HeaderProps) => {
  const router = useRouter();
  const [renameModalVisible, setRenameModalVisible] = useState(false);

  return (
    <Provider>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#fff",
          marginTop: 20,
          paddingRight: 10,
        }}
      >
        {/* Back + Title */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="#333" />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: "#333",
              marginLeft: 10,
            }}
          >
            {name}
          </Text>
        </View>

        {/* 3 Dots Menu */}
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <TouchableOpacity onPress={openMenu}>
              <Entypo name="dots-three-vertical" size={18} color="#333" />
            </TouchableOpacity>
          }
        >
          <Menu.Item
            onPress={() => {
              closeMenu();
              setRenameModalVisible(true); // open modal
            }}
            title="Rename"
          />
          <Menu.Item
            onPress={() => {
              closeMenu();
              onDelete();
            }}
            title="Delete"
            titleStyle={{ color: "#dc3545" }}
          />
        </Menu>
      </View>

      {/* Custom Rename Modal */}
      <RenameModal
        visible={renameModalVisible}
        onClose={() => setRenameModalVisible(false)}
        onSubmit={(newName:any) => {
          onRename(newName);
          setRenameModalVisible(false);
        }}
      />
    </Provider>
  );
};

export default HeaderWithMenu;
