import { TouchableOpacity, useWindowDimensions } from "react-native";
import React, { useState } from "react";
import { Input, XStack, YStack, View } from "tamagui";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
const IngredientSection = () => {
  const ScreenWidth = useWindowDimensions().width;
  const [ingredients, setIngredients] = useState([{ name: "", quantity: "" }]);
  const form = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "Ingredient",
    rules: { minLength: 1 },
  });
  const handleAddIngredient = () => {
    append({ name: "", value: "" });
  };

  const handleInputChange = (index: number, field: string, value: string) => {
    setIngredients((prevState) =>
      prevState.map((ingredient, i) =>
        i === index ? { ...ingredient, [field]: value } : ingredient
      )
    );
  };
  const handleRemoveIngredient = () => {
    setIngredients(ingredients.slice(0, ingredients.length - 1));
  };
  console.log(fields);

  return (
    <YStack justifyContent="center">
      {fields.map((field, index) => (
        <XStack
          key={field.id}
          justifyContent="space-between"
          alignItems="center"
          paddingBottom={"$2"}
          gap={"$2"}
        >
          <Controller
            name={`Ingredient.${index}.name`}
            control={form.control}
            render={({ field: { value, onChange } }) => (
              <Input
                placeholder="name"
                width={ScreenWidth * 0.37}
                value={value}
                onChangeText={onChange}
                borderColor={"$orange9"}
                borderWidth={1}
                focusStyle={{ borderColor: "$orange10", borderWidth: 2 }}
              />
            )}
          />

          <Controller
            name={`Ingredient.${index}.quantity`}
            control={form.control}
            render={({ field: { value, onChange } }) => (
              <Input
                placeholder="quantity"
                width={ScreenWidth * 0.37}
                value={value}
                onChangeText={onChange}
                borderColor={"$orange9"}
                borderWidth={1}
                focusStyle={{ borderColor: "$orange10", borderWidth: 2 }}
              />
            )}
          />
          <XStack flexGrow={1} justifyContent="flex-end">
            {index === 0 ? null : (
              <TouchableOpacity onPress={() => remove(index)}>
                <MaterialIcons
                  name="highlight-remove"
                  size={30}
                  color="hsl(24, 100%, 46.5%)"
                />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => append({ name: "", quantity: "" })}
            >
              <Ionicons
                name="add-circle"
                size={30}
                color="hsl(24, 100%, 46.5%)"
              />
            </TouchableOpacity>
          </XStack>
        </XStack>
      ))}
    </YStack>
  );
};

export default IngredientSection;
