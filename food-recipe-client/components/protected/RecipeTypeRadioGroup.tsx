import { RadioGroup, XStack, Label } from "tamagui";
import React from "react";

const RecipeTypeRadioGroup = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (arg: string) => void;
}) => {
  return (
    <RadioGroup
      aria-labelledby="Select one item"
      defaultValue="Veg"
      onValueChange={onChange}
    >
      <XStack justifyContent="space-between" flex={1} space="$10">
        <XStack alignItems="center" space="$4">
          <RadioGroup.Item
            value={"Veg"}
            id={"Veg"}
            size={"$5"}
            borderColor={"$orange10"}
          >
            <RadioGroup.Indicator backgroundColor={"$orange10"} />
          </RadioGroup.Item>
          <Label size={"$6"} htmlFor={"Veg"}>
            Veg
          </Label>
        </XStack>
        <XStack alignItems="center" space="$4">
          <RadioGroup.Item
            value={"NonVeg"}
            id={"NonVeg"}
            size={"$5"}
            borderColor={"$orange10"}
          >
            <RadioGroup.Indicator backgroundColor={"$orange10"} />
          </RadioGroup.Item>
          <Label size={"$6"} htmlFor={"NonVeg"}>
            Non veg
          </Label>
        </XStack>
      </XStack>
    </RadioGroup>
  );
};

export default RecipeTypeRadioGroup;
