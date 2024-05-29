import { RadioGroup, XStack, Label, YStack, H3 } from "tamagui";
import React from "react";
import { FlatList } from "react-native";
import { useFormContext, Controller } from "react-hook-form";

const CuisineSelect = () => {
  const cuisines = [
    "Thai",
    "American",
    "Chinese",
    "Mexican",
    "Indian",
    "Nepali",
    "Spanish",
  ];
  const form = useFormContext();
  return (
    <YStack>
      <Label fontSize={"$6"} fontWeight={"bold"}>
        Cuisine *
      </Label>
      <Controller
        name="cuisine"
        control={form.control}
        render={({ field: { onChange, value } }) => (
          <RadioGroup
            aria-labelledby="Select one item"
            defaultValue={value}
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
        )}
      />
      {form.formState.errors.cuisine && (
        <H3 color={"$red10"} fontSize={13}>
          {form.formState.errors.cuisine.message}
        </H3>
      )}
    </YStack>
  );
};

export default CuisineSelect;
