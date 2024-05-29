import { RadioGroup, XStack, Label, YStack, H3 } from "tamagui";
import React from "react";
import { useFormContext, Controller } from "react-hook-form";

const RecipeTypeRadioGroup = () => {
  const form = useFormContext();
  return (
    <YStack>
      <XStack alignItems="center" space="$10">
        <Label fontSize={"$6"} fontWeight={"bold"}>
          Type *:
        </Label>
        <Controller
          control={form.control}
          name="type"
          render={({ field: { onChange, value } }) => (
            <RadioGroup
              aria-labelledby="Select one item"
              defaultValue={value}
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
          )}
        />
      </XStack>
      {form.formState.errors.type && (
        <H3 color={"$red10"} fontSize={13}>
          {form.formState.errors.type.message}
        </H3>
      )}
    </YStack>
  );
};

export default RecipeTypeRadioGroup;
