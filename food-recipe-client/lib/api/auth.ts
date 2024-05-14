import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { LoginSchema } from "../zod/auth";
import Toast from "react-native-toast-message";
export const useLoginMutation = () => {
  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof LoginSchema>) => {
      try {
        const response = await fetch("http://10.0.2.2:3000/api/v1/auth/login", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(data),
        });
        const responseJson = await response.json();
        return responseJson;
      } catch (error) {
        console.log(error);
      }
    },
    onError: (error) => {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "some server side error taken place",
        text2: "This is some something 👋",
      });
      return "error";
    },
    onSuccess: (data: any) => {
      if (data?.error) {
        console.log(data.error);

        Toast.show({
          type: "error",
          text1: data.error,
        });
        return "error";
      } else {
        Toast.show({
          type: "success",
          text1: data.message,
        });
        return data;
      }
    },
  });
  return mutation;
};
