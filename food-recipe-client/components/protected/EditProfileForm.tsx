import { Text } from "react-native";
import React from "react";
import CustomAlertDialog from "../ui/CustomAlertDialog";
import {
  Avatar,
  Input,
  Label,
  YStack,
  H3,
  Button,
  XStack,
  Spinner,
} from "tamagui";
import { useRecipeStore } from "@/lib/store";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserInfoSchema } from "@/lib/zod/user";
import { useSelectImage } from "@/hooks/useSelectImage";
import { z } from "zod";
import { useUpdateProfileMutation } from "@/lib/api/user";
const EditProfileForm = () => {
  const default_image = require("../../assets/images/default_image.jpg");
  const { profile } = useRecipeStore();
  const { file, pickImage } = useSelectImage();
  const { isPending, mutate: UpdateProfileMutate } = useUpdateProfileMutation();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<z.infer<typeof updateUserInfoSchema>>({
    resolver: zodResolver(updateUserInfoSchema),
    defaultValues: {
      full_name: profile?.full_name,
      password: "",
    },
  });
  const onSubmit = handleSubmit(
    async (values: z.infer<typeof updateUserInfoSchema>) => {
      const formData = new FormData();
      if (values.full_name !== profile?.full_name) {
        formData.append("full_name", values.full_name!);
      }
      if (values.password && values.password.length > 6) {
        formData.append("password", values.password);
      }
      if (file) {
        formData.append("image", {
          name: file?.fileName?.split(".")[0],
          uri: file?.uri,
          type: file?.mimeType,
          size: file?.fileSize,
        } as any);
      }
      try {
        await UpdateProfileMutate(formData);
      } catch (error) {
        console.log(error);
      }
    }
  );
  if (isPending) {
    <YStack flexGrow={1} justifyContent="center" alignItems="center">
      <Spinner size="large" color={"$orange9"} />
    </YStack>;
  }
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
