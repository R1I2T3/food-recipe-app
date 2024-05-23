import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { YStack, Label, Input, H3 } from "tamagui";
import { Controller, useFormContext } from "react-hook-form";
const CustomInput = (props: { Name: string }) => {
  const form = useFormContext();

  return (
    <YStack>
      <Label fontSize={"$6"} fontWeight={"bold"}>
        {(
          props.Name[0].toUpperCase() +
          props.Name.slice(1, props.Name.length + 1)
        ).replace("_", " ")}{" "}
        *
      </Label>
      <Controller
        control={form.control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            backgroundColor={"#ffffff"}
            borderColor={"$orange9"}
            placeholder="Enter name of recipe"
            borderWidth={1}
            focusStyle={{ borderColor: "$orange10", borderWidth: 1 }}
          />
        )}
        name={props.Name}
      />
      {form.formState.errors?.hasOwnProperty(props.Name) && (
        <H3 color={"$red10"} fontSize={13}>
          This field is required
        </H3>
      )}
    </YStack>
  );
};

export default CustomInput;

const styles = StyleSheet.create({});
