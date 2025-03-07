import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  PanResponder,
} from "react-native";
import { MaterialIcons, Feather } from "@expo/vector-icons";

function ContactItem({ contact, onDelete, onUpdate }) {
  const [translateX] = useState(new Animated.Value(0));
  const [itemHeight] = useState(new Animated.Value(80));
  const [opacity] = useState(new Animated.Value(1));

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dx) > 5;
    },
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dx < 0) {
        // Only allow left swipe
        translateX.setValue(Math.max(gestureState.dx, -100));
      } else {
        // Reset if swiping right
        translateX.setValue(0);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx < -50) {
        // If swipe is more than threshold, show delete
        Animated.spring(translateX, {
          toValue: -100,
          useNativeDriver: true,
        }).start();
      } else {
        // Reset position
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  const deleteItem = () => {
    // Animate the height and opacity when deleting
    Animated.parallel([
      Animated.timing(itemHeight, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start(() => {
      onDelete(contact.id);
    });
  };

  // Initials for the avatar
  const getInitials = () => {
    const nameParts = contact.name.split(" ");
    if (nameParts.length > 1) {
      return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`;
    }
    return contact.name[0];
  };

  // Random color for the avatar
  const getAvatarColor = () => {
    const colors = [
      "#FFC107",
      "#FF5722",
      "#2196F3",
      "#4CAF50",
      "#9C27B0",
      "#3F51B5",
    ];
    const hash = contact.name
      .split("")
      .reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    return colors[hash % colors.length];
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          height: itemHeight,
          opacity: opacity,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.deleteAction,
          {
            opacity: translateX.interpolate({
              inputRange: [-100, -50, 0],
              outputRange: [1, 0.5, 0],
              extrapolate: "clamp",
            }),
          },
        ]}
      >
        <TouchableOpacity onPress={deleteItem} style={styles.deleteButton}>
          <Feather name="trash-2" size={22} color="white" />
        </TouchableOpacity>
      </Animated.View>

      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.contactItem,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.content}
          activeOpacity={0.7}
          onPress={() => onUpdate(contact)}
        >
          <View style={[styles.avatar, { backgroundColor: getAvatarColor() }]}>
            <Text style={styles.initials}>{getInitials()}</Text>
          </View>

          <View style={styles.contactInfo}>
            <Text style={styles.name}>{contact.name}</Text>
            <View style={styles.phoneContainer}>
              <MaterialIcons name="phone" size={14} color="#666" />
              <Text style={styles.phone}>{contact.phone}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}

export default ContactItem;

const styles = StyleSheet.create({
  container: {
    height: 80,
    marginVertical: 5,
    position: "relative",
  },
  deleteAction: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 100,
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: 20,
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  contactItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  initials: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  contactInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 3,
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  phone: {
    fontSize: 14,
    color: "#666",
    marginLeft: 5,
  },
});
