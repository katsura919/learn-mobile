import { HeaderProps } from "@/utils/type";
import { View } from 'react-native';
import React, { useState } from "react";
import { Appbar, Menu, Provider } from "react-native-paper";
import { useRouter } from "expo-router";
import RenameModal from "./lesson-list-rename-modal";
import { useAppTheme } from "@/hooks/themeContext";

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
  const { theme } = useAppTheme();
  const { colors } = theme;

  return (
    <View>
      <Appbar.Header
        mode="small"
        style={{ backgroundColor: colors.background }}
      >
        <Appbar.BackAction onPress={() => router.back()} color={colors.onBackground} />
        <Appbar.Content title={name} titleStyle={{ color: colors.onBackground,  fontFamily: 'Inter-Medium', fontSize: 16, }} />
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <Appbar.Action icon="dots-vertical" color={colors.onBackground} onPress={openMenu} />
          }
        >
          <Menu.Item
            onPress={() => {
              closeMenu();
              setRenameModalVisible(true);
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
      </Appbar.Header>

      {/* Rename Modal */}
      <RenameModal
        visible={renameModalVisible}
        onClose={() => setRenameModalVisible(false)}
        onSubmit={(newName: any) => {
          onRename(newName);
          setRenameModalVisible(false);
        }}
      />
    </View>
  );
};

export default HeaderWithMenu;
