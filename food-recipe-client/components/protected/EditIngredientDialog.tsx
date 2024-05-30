import { Adapt, Button, Dialog, Sheet, Spinner, XStack } from "tamagui";
import IngredientSection from "./IngredientSection";
import { FormProvider, useFormContext } from "react-hook-form";

interface EditIngredientDialogPropsType {
  children: React.ReactNode;
  DialogTitle: string;
  DialogActionTitle: string;
  ShowIngredientSectionAddButton: boolean;
  DialogAction: (values: any) => void;
  isPending: boolean;
}
export const EditIngredientDialog = (props: EditIngredientDialogPropsType) => {
  const form = useFormContext();
  return (
    <Dialog modal>
      <Dialog.Trigger asChild>{props.children}</Dialog.Trigger>
      <Adapt when="sm" platform="touch">
        <Sheet animation="medium" zIndex={200000} modal dismissOnSnapToBottom>
          <Sheet.Frame padding="$4" gap="$4">
            <Adapt.Contents />
          </Sheet.Frame>

          <Sheet.Overlay
            animation="lazy"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
        </Sheet>
      </Adapt>
      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation="slow"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Dialog.Content
          bordered
          elevate
          key="content"
          animateOnly={["transform", "opacity"]}
          animation={[
            "quicker",
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          gap="$4"
        >
          <Dialog.Title>{props.DialogTitle}</Dialog.Title>
          <FormProvider {...form}>
            <IngredientSection
              showRemoveIngredientButton={!props.ShowIngredientSectionAddButton}
              showAddIngredientButton={props.ShowIngredientSectionAddButton}
            />
          </FormProvider>
          <XStack justifyContent="space-between" gap="$4">
            <Dialog.Close displayWhenAdapted asChild>
              <Button
                flexGrow={1}
                backgroundColor={"#ffff"}
                borderColor={"$orange9"}
                color={"$orange10"}
                fontSize={16}
              >
                Close
              </Button>
            </Dialog.Close>
            <Dialog.Close displayWhenAdapted asChild>
              <Button
                theme="active"
                aria-label="Close"
                flexGrow={1}
                backgroundColor={"$orange10"}
                color={"white"}
                fontSize={16}
                onPress={props.DialogAction}
                disabled={props.isPending}
              >
                {props.isPending ? (
                  <Spinner color={"white"} />
                ) : (
                  props.DialogActionTitle
                )}
              </Button>
            </Dialog.Close>
          </XStack>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
};
