import { useWindowDimensions } from "react-native";
import { Image, Button } from "tamagui";
const SelectRecipeImage = ({
  file,
  resetForm,
  pickImage,
}: {
  file: any;
  resetForm: boolean;
  pickImage: () => any;
}) => {
  const width = useWindowDimensions().width;
  return (
    <Button
      width={width * 0.94}
      height={width * 0.7}
      backgroundColor={"$orange2"}
      fontSize={"$6"}
      pressStyle={{ backgroundColor: "$orange3" }}
      onPress={pickImage}
      borderColor={"$orange9"}
    >
      {resetForm || !file ? (
        "Select  a recipe image"
      ) : (
        <Image src={file.uri} width={width * 0.94} height={width * 0.7} />
      )}
    </Button>
  );
};

export default SelectRecipeImage;
