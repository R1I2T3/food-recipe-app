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
      }
      return data;
    },
  });
  return mutation;
};

export const useSignUpMutation = () => {
  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      try {
        const response = await fetch(
          "http://10.0.2.2:3000/api/v1/auth/signup",
          {
            method: "POST",
            body: data,
          }
        );
        const responseJson = await response.json();
        return responseJson;
      } catch (error) {
        console.log(error);
      }
    },
    onError: async (error) => {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "some server side error taken place",
      });
      return "error";
    },
    onSuccess: async (data: any) => {
      if (data?.error) {
        console.log(data.error);
        Toast.show({
          type: "error",
          text1: data.error,
        });
        return "error";
      }
      return data;
    },
  });
  return mutation;
};
