import { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

function ContactInput({ visible, onAddContact, onCancel, editingContact }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (editingContact) {
      setName(editingContact.name);
      setPhone(editingContact.phone);
    } else {
      setName("");
      setPhone("");
    }
  }, [editingContact]);

  function formatPhoneNumber(input) {
    let cleaned = input.replace(/\D/g, "");

    if (cleaned.startsWith("09") && cleaned.length === 11) {
      cleaned = "+63" + cleaned.slice(1);
    }

    if (cleaned.startsWith("+639") && cleaned.length === 13) {
      return (
        "+63 " +
        cleaned.slice(3, 6) +
        " " +
        cleaned.slice(6, 9) +
        " " +
        cleaned.slice(9)
      );
    }

    return input;
  }

  function handleSubmit() {
    if (name.trim() === "" || phone.trim() === "") {
      alert("Please fill in all fields");
      return;
    }
    onAddContact(name, phone);
  }

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardAvoid}
          >
            <View style={styles.modalContent}>
              <View style={styles.header}>
                <Text style={styles.modalTitle}>
                  {editingContact ? "Edit Contact" : "New Contact"}
                </Text>
                <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
                  <AntDesign name="close" size={20} color="#999" />
                </TouchableOpacity>
              </View>

              <View style={styles.inputFields}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Name</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter full name"
                    placeholderTextColor="#999"
                    onChangeText={setName}
                    value={name}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Phone</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Philippine number only"
                    placeholderTextColor="#999"
                    keyboardType="phone-pad"
                    onChangeText={(text) => setPhone(formatPhoneNumber(text))}
                    value={phone}
                  />
                  <Text style={styles.hint}>Format: +63 XXX XXX XXXX</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
              >
                <Text style={styles.submitButtonText}>
                  {editingContact ? "Update" : "Save"}
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

export default ContactInput;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  keyboardAvoid: {
    width: "100%",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  closeButton: {
    padding: 5,
  },
  inputFields: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    marginBottom: 5,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  hint: {
    fontSize: 12,
    color: "#999",
    marginTop: 5,
  },
  submitButton: {
    backgroundColor: "#007AFF",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
