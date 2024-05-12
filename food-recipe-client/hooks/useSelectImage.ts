import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
export const useSelectImage = () => {
  const [image, setImage] = useState("");
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  return [image, pickImage];
};
