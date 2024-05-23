import { RadioGroup, XStack, Label, ScrollView } from "tamagui";
import React from "react";
import { FlatList } from "react-native";

const CuisineSelect = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (arg: string) => void;
}) => {
  const cuisines = [
    "Thai",
    "American",
    "Chinese",
    "Mexican",
    "Indian",
    "Nepali",
    "Spanish",
  ];
  return (
    <RadioGroup
      aria-labelledby="Select one item"
      defaultValue={"Thai"}
      onValueChange={onChange}
    >
      {
        <FlatList
          data={cuisines}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <XStack alignItems="center" key={item}>
              <RadioGroup.Item
                value={item}
                id={item}
                size={"$5"}
                borderColor={"$orange10"}
              >
                <RadioGroup.Indicator backgroundColor={"$orange10"} />
              </RadioGroup.Item>
              <Label size={"$6"} htmlFor={item} marginHorizontal={"$3"}>
                {item}
              </Label>
            </XStack>
          )}
        />
      }
    </RadioGroup>
  );
};

export default CuisineSelect;
