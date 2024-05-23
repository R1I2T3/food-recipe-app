import React from "react";
import { YStack, Label, TextArea, H3 } from "tamagui";
import { Controller, useFormContext } from "react-hook-form";
const RecipeInstructionTextField = () => {
  const form = useFormContext();
  return (
    <YStack>
      <Label fontSize={"$6"} fontWeight={"bold"}>
        Instructions *
      </Label>
      <Controller
        name="instruction"
        control={form.control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextArea
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            placeholder="Enter recipe details"
            paddingTop={0}
            backgroundColor={"#ffffff"}
            borderColor={"$orange9"}
            borderWidth={1}
            focusStyle={{ borderColor: "$orange10", borderWidth: 1 }}
          />
        )}
      />
      {form.formState.errors.instruction && (
        <H3 color={"$red10"} fontSize={13}>
          {form.formState.errors.instruction.message}
        </H3>
      )}
    </YStack>
  );
};

export default RecipeInstructionTextField;
