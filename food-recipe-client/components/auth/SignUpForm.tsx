import {
  Button,
  Form,
  Input,
  Label,
  YStack,
  H3,
  RadioGroup,
  XStack,
  Avatar,
} from "tamagui";
import { TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useSelectImage } from "@/hooks/useSelectImage";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { SignUpSchema } from "@/lib/zod/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Spinner } from "tamagui";
import Toast from "react-native-toast-message";
import { useSignUpMutation } from "@/lib/api/auth";
import { useSaveUser } from "@/utils/saveUser";
const SignUpForm = () => {
  const router = useRouter();
  const RadioGroupValues = ["Male", "Female", "Other"];
  const default_image = require("../../assets/images/default_image.jpg");
  const { file, pickImage } = useSelectImage();
  const { SaveUser } = useSaveUser();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      username: "",
      full_name: "",
      password: "",
      gender: "Male",
    },
  });

  const { mutateAsync: singUpMutate, isPending } = useSignUpMutation();
  if (isPending) {
    return (
      <YStack padding="$3" space="$4" alignItems="center">
        <XStack alignItems="center">
          <Spinner size="large" color="$orange10" />
        </XStack>
      </YStack>
    );
  }
  const onSubmit = async (values: z.infer<typeof SignUpSchema>) => {
    try {
      const formData = new FormData();
      const image = {
        name: file?.fileName?.split(".")[0],
        uri: file?.uri,
        type: file?.mimeType,
        size: file?.fileSize,
      };
      formData.append("image", image as any);
      for (let [key, value] of Object.entries(values)) {
        if (!(typeof value == "string")) {
          console.log();
          return;
        }
        formData.append(key, value);
      }
      const data = await singUpMutate(formData);
      console.log(data);

      const message = await SaveUser(data);
      if (message === "failure") {
        Toast.show({
          type: "error",
          text1: "Failed to save user",
        });
      } else {
        Toast.show({
          type: "success",
          text1: data.message,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <ScrollView>
      <YStack>
        <Button onPress={pickImage} unstyled>
          <Avatar circular size="$10" margin="auto" marginTop="$4">
            <Avatar.Image
              accessibilityLabel="Cam"
              src={file?.uri || default_image}
            />
            <Avatar.Fallback backgroundColor="$blue10" />
          </Avatar>
        </Button>
        <YStack paddingHorizontal={"$4"}>
          <Label fontSize={20}>Username</Label>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                borderColor={"$black10"}
                borderWidth={1}
                focusStyle={{ borderWidth: 2, borderColor: "#000" }}
                placeholder="Enter your username"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                fontSize={15}
              />
            )}
            name="username"
          />
          {errors.username && (
            <H3 color={"$red10"} fontSize={13}>
              {errors.username.message}
            </H3>
          )}
        </YStack>
        <YStack paddingHorizontal={"$4"}>
          <Label fontSize={20}>Full Name</Label>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                borderColor={"$black10"}
                borderWidth={1}
                focusStyle={{ borderWidth: 2, borderColor: "#000" }}
                placeholder="Enter your Full Name"
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
        <YStack paddingHorizontal={"$4"}>
          <Label fontSize={20}>Password</Label>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                borderColor={"$black10"}
                borderWidth={1}
                focusStyle={{ borderWidth: 2, borderColor: "#000" }}
                placeholder="Enter your password"
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
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          name="gender"
          render={({ field: { onChange, onBlur, value } }) => (
            <RadioGroup
              aria-labelledby="Select one item"
              defaultValue={value}
              onValueChange={(value) => onChange(value)}
              onBlur={onBlur}
              name="gender"
              paddingHorizontal="$4"
            >
              <XStack justifyContent="space-between">
                {RadioGroupValues.map((radioGroupValue) => (
                  <XStack
                    key={radioGroupValue}
                    alignItems="center"
                    space={"$2"}
                  >
                    <RadioGroup.Item
                      value={radioGroupValue}
                      id={radioGroupValue}
                      size={"$4"}
                    >
                      <RadioGroup.Indicator />
                    </RadioGroup.Item>
                    <Label size={"$6"} htmlFor={radioGroupValue}>
                      {radioGroupValue}
                    </Label>
                  </XStack>
                ))}
              </XStack>
            </RadioGroup>
          )}
        />
        <YStack paddingHorizontal={"$4"} alignItems="flex-end">
          <TouchableOpacity onPress={() => router.dismissAll()}>
            <H3
              textAlign="right"
              fontSize={14}
              color={"$blue8"}
              textDecorationLine="underline"
              textDecorationStyle="dashed"
            >
              Don't have account then Login
            </H3>
          </TouchableOpacity>
        </YStack>
        <YStack paddingHorizontal={"$4"} paddingVertical={"$3"}>
          <Button
            backgroundColor={"$orange10"}
            color={"white"}
            fontSize={"$6"}
            pressStyle={{ backgroundColor: "$orange8" }}
            onPress={handleSubmit(onSubmit)}
          >
            Sign up
          </Button>
        </YStack>
      </YStack>
    </ScrollView>
  );
};

export default SignUpForm;
