import { Button, Spinner, YStack, Text } from "tamagui";
import React, { useRef, useState } from "react";
import Header from "@/components/protected/Header";
import { FlatList } from "react-native";
import { useGetAllRecipeQuery } from "@/lib/api/recipe";
import HomeScreenPagination from "@/components/protected/HomeScreenPagination";
// import { ingredientsCollection, recipeCollection } from "@/lib/db";

const Home = () => {
  const Filters = [
    { label: "All", value: "" },
    { label: "Veg", value: "Veg" },
    { label: "Non Veg", value: "NonVeg" },
    { label: "Thai", value: "Thai" },
    { label: "American", value: "American" },
    { label: "Chinese", value: "Chinese" },
    { label: "Mexican", value: "Mexican" },
    { label: "Indian", value: "Indian" },
    { label: "Nepali", value: "Nepali" },
    { label: "Spanish", value: "Spanish" },
  ];
  const filterRef = useRef<FlatList>(null);
  const [filter, setFilter] = useState("");
  const { data, error, status, fetchNextPage, isFetchingNextPage } =
    useGetAllRecipeQuery(filter);
  const onPressFilter = (FilterValue: string) => {
    if (filter === FilterValue) {
      setFilter("");
      filterRef?.current?.scrollToIndex({ animated: true, index: 0 });
    } else {
      setFilter(FilterValue);
    }
  };
  if (error) {
    return (
      <YStack justifyContent="center" alignItems="center" flexGrow={1}>
        <Text color={"$red9"}>Some error take place while fetching recipe</Text>
      </YStack>
    );
  }
  if (status === "pending") {
    return (
      <YStack justifyContent="center" alignItems="center" flexGrow={1}>
        <Spinner color={"$red9"} />
      </YStack>
    );
  }
  return (
    <>
      <Header />
      <YStack padding={10} backgroundColor={"$orange1"} flexGrow={1}>
        <FlatList
          data={Filters}
          ref={filterRef}
          keyExtractor={(item) => item.value}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <Button
              marginRight={"$4"}
              backgroundColor={filter === item.value ? "$orange9" : "white"}
              color={filter === item.value ? "white" : "$orange9"}
              fontSize={"$5"}
              onPress={() => onPressFilter(item.value)}
              borderColor={filter === item.value ? "white" : "$orange9"}
              pressStyle={{ backgroundColor: "$orange6" }}
              paddingHorizontal={"$7"}
            >
              {item.label}
            </Button>
          )}
          horizontal
        />
      </YStack>
      <FlatList
        onEndReached={async () => await fetchNextPage}
        data={data?.pages!}
        renderItem={({ item, index }) => (
          <HomeScreenPagination item={item} key={index} />
        )}
      />
    </>
  );
};

export default Home;
