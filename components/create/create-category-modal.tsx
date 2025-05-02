import React from "react";
import { Modal, View, FlatList, StyleSheet, Animated } from "react-native";
import { Button, TextInput, Text, useTheme, IconButton, TouchableRipple } from "react-native-paper";
import { useRef, useEffect } from "react";

export default function CategoryModal({
  visible,
  onClose,
  onSubmit,
  value,
  onChangeText,
  categories,
  onCategorySelect,
}: any) {
  const theme = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      transparent
      animationType="fade"
    >
      <Animated.View
        style={[
          styles.modalOverlay,
          { opacity: fadeAnim, backgroundColor: "rgba(0,0,0,0.5)" },
        ]}
      >
        <View style={[styles.modalCard, { backgroundColor: theme.colors.surface }]}>

          <IconButton
            icon="close"
            size={20}
            onPress={onClose}
            style={styles.closeButton}
            iconColor={theme.colors.onSurface}
          />

          <Text variant="headlineSmall" style={styles.modalTitle}>
            Select Category
          </Text>
          <Text variant="bodyMedium" style={styles.modalSubtitle}>
            Choose or create a new one
          </Text>

       
          <View style={styles.listContainer}>
            <FlatList
              data={categories}
              renderItem={({ item }) => (
                <TouchableRipple
                  onPress={() => onCategorySelect(item.name)}
                  style={styles.categoryItem}
                >
                  <Text variant="bodyLarge" style={styles.categoryText}>
                    {item.name}
                  </Text>
                </TouchableRipple>
              )}
              keyExtractor={(item) => item._id}
              style={styles.categoryList}
              showsVerticalScrollIndicator={true}
              indicatorStyle={theme.dark ? "white" : "black"}
              fadingEdgeLength={20}
              persistentScrollbar={true}
            />
            <View style={styles.scrollHintBottom} />
          </View>


          <TextInput
            mode="outlined"
            label="New Category"
            value={value}
            onChangeText={onChangeText}
            style={styles.input}
            outlineStyle={styles.inputOutline}
          />


          <Button
            mode="contained"
            onPress={onSubmit}
            disabled={!value.trim()}
            style={styles.submitButton}
          >
            Create
          </Button>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalCard: {
    width: "100%",
    maxHeight: "80%",
    borderRadius: 16,
    padding: 24,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  closeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    margin: 0,
  },
  modalTitle: {
    fontWeight: "600",
    marginBottom: 4,
    marginTop: 8,
  },
  modalSubtitle: {
    color: "#666",
    marginBottom: 16,
  },
  listContainer: {
    maxHeight: 200,
    position: "relative",
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  categoryList: {
    paddingHorizontal: 8,
  },
  categoryItem: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  categoryText: {
    fontWeight: "500",
  },
  // Gradient Scroll Hint
  scrollHintBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 20,
  },
  input: {
    marginBottom: 20,
    backgroundColor: "transparent",
  },
  inputOutline: {
    borderRadius: 12,
    borderWidth: 1.5,
  },
  submitButton: {
    borderRadius: 12,
  },
});