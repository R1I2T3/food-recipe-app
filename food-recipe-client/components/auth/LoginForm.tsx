import { Link } from "expo-router";
import { Button, Input, Label, YStack, H3, Spinner, XStack } from "tamagui";
import { LoginSchema } from "@/lib/zod/auth";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import * as secureStore from "expo-secure-store";
import { useLoginMutation } from "@/lib/api/auth";
import { userCollection, database } from "@/lib/db";
import * as FileSystem from "expo-file-system";
export const LoginForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const { mutateAsync: LoginMutate, isPending } = useLoginMutation();
  if (isPending) {
    return (
      <YStack padding="$3" space="$4" alignItems="center">
        <XStack alignItems="center">
          <Spinner size="large" color="$orange10" />
        </XStack>
      </YStack>
    );
  }
  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    const data = await LoginMutate(values);
    if (data === "error") {
      return;
    }
    if (secureStore.getItem("auth_token")) {
      await secureStore.deleteItemAsync("auth_token");
    }
    await secureStore.setItemAsync("auth_token", data.token);
    const { uri: avatarImage } = await FileSystem.downloadAsync(
      data.userDetails.avatar_url,
      FileSystem.documentDirectory +
        data.userDetails.avatar_url.split("/").pop()
    );
    try {
      await database.write(async () => {
        await userCollection.create((newUser) => {
          newUser.UserId = data.userDetails.id;
          newUser.username = data.userDetails.username;
          newUser.fullName = data.userDetails.full_name;
          newUser.gender = data.userDetails.gender;
          newUser.createdAt = data.userDetails.createdAt;
          newUser.avatar_url = avatarImage;
        });
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <YStack>
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
      <YStack paddingHorizontal={"$4"} alignItems="flex-end">
        <Link href={"/auth/signup"}>
          <H3
            textAlign="right"
            fontSize={14}
            color={"$blue8"}
            textDecorationLine="underline"
            textDecorationStyle="dashed"
          >
            Don't have account then Login
          </H3>
        </Link>
      </YStack>
      <YStack paddingHorizontal={"$4"} paddingVertical={"$3"}>
        <Button
          backgroundColor={"$orange10"}
          color={"white"}
          fontSize={"$6"}
          pressStyle={{ backgroundColor: "$orange8" }}
          onPress={handleSubmit(onSubmit)}
        >
          Log in
        </Button>
      </YStack>
    </YStack>
  );
};
