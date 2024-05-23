import { Text } from "react-native";
import React from "react";
import CustomAlertDialog from "../ui/CustomAlertDialog";
import { Avatar, Input, Label, YStack, H3, Button } from "tamagui";
import { useRecipeStore } from "@/lib/store";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserInfoSchema } from "@/lib/zod/user";
import { useSelectImage } from "@/hooks/useSelectImage";
import { z } from "zod";
const EditProfileForm = () => {
  const default_image = require("../../assets/images/default_image.jpg");
  const { profile } = useRecipeStore();
  const { file, pickImage } = useSelectImage();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<z.infer<typeof updateUserInfoSchema>>({
    resolver: zodResolver(updateUserInfoSchema),
    defaultValues: {
      full_name: profile?.fullName,
      password: "",
    },
  });
  const onSubmit = handleSubmit(
    (values: z.infer<typeof updateUserInfoSchema>) => {
      console.log(values);
    }
  );
  return (
    <YStack backgroundColor={"$orange1"}>
      <YStack justifyContent="center" alignItems="center" marginVertical={10}>
        <Button onPress={pickImage} unstyled marginBottom={2}>
          <Avatar circular size={"$10"}>
            <Avatar.Image src={file?.uri || default_image} />
          </Avatar>
        </Button>
        <Text>New Profile Pic</Text>
      </YStack>
      <YStack marginBottom="3">
        <Label fontSize={"$7"} fontFamily={"$mono"}>
          Full Name
        </Label>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              borderBottomColor={"$orange8"}
              borderWidth={1}
              focusStyle={{ borderWidth: 2, borderBottomColor: "$orange8" }}
              placeholder="Enter your username"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              fontSize={15}
            />
          )}
          name="full_name"
        />
        {errors.full_name && (
          <H3 color={"$red10"} fontSize={13}>
            {errors.full_name.message}
          </H3>
        )}
      </YStack>
      <YStack marginBottom="$3">
        <Label fontSize={"$7"} fontFamily={"$mono"}>
          Password
        </Label>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              borderBottomColor={"$orange8"}
              borderWidth={1}
              focusStyle={{ borderWidth: 2, borderBottomColor: "$orange8" }}
              placeholder="Enter your new password"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              fontSize={15}
            />
          )}
          name="password"
        />
        {errors.password && (
          <H3 color={"$red10"} fontSize={13}>
            {errors.password.message}
          </H3>
        )}
      </YStack>
      <CustomAlertDialog
        AlertButtonTriggerLabel="Update"
        AlertDialogActionTitle="Update"
        AlertDialogTitle="Edit Profile"
        AlertDialogDescription="Are you sure about edit your profile"
        AlertDialogAction={onSubmit}
      />
    </YStack>
  );
};

export default EditProfileForm;