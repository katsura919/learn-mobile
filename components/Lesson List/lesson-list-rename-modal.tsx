import React, { useState } from "react";
import { RenameModalProps } from "@/utils/type";
import { Portal, Dialog, TextInput, Button, useTheme } from "react-native-paper";
import { View, StyleSheet } from "react-native";

const RenameModal = ({ visible, onClose, onSubmit }: RenameModalProps) => {
  const [newName, setNewName] = useState("");
  const { colors } = useTheme();

  const handleSubmit = () => {
    if (newName.trim()) {
      onSubmit(newName.trim());
      setNewName("");
      onClose();
    }
  };

  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={onClose}
        style={{
          borderRadius: 6,
          backgroundColor: colors.surface,
          paddingHorizontal: 0,
          paddingBottom: 8,
        }}
      >
        {/* Input */}
        <Dialog.Content style={{ paddingTop: 0, paddingBottom: 16 }}>
          <TextInput
            mode="flat"
            placeholder="Enter new name"
            value={newName}
            onChangeText={setNewName}
            style={{
              backgroundColor: colors.elevation.level1,
              borderRadius: 4,
              marginBottom: 10,
              width: "100%", 
            }}
            underlineColor="transparent"
            placeholderTextColor={colors.onSurfaceVariant}
            theme={{ colors: { text: colors.onSurface } }}
          />
        </Dialog.Content>

        {/* Bottom Button Row */}
        <Dialog.Actions style={styles.actions}>
          <Button
            mode="contained"
            onPress={onClose}
            style={[
              styles.button,
              {
                backgroundColor: "#D32F2F", 
              },
            ]}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={handleSubmit}
            style={[styles.button, { backgroundColor: colors.primary }]}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
          >
            Save
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  button: {
    borderRadius: 6,
    height: 48,
    width: "48%",  
  },
  buttonContent: {
    height: "100%",
    justifyContent: "center",
  },
  buttonLabel: {
    fontWeight: "600",
    fontSize: 15,
  },
});

export default RenameModal;
