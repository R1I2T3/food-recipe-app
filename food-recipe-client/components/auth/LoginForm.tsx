import { Link } from "expo-router";
import { Button, Input, Label, YStack, H3 } from "tamagui";
import { LoginSchema } from "@/lib/zod/auth";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    console.log(values);
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
