export function objectEqual(obj1: any, obj2: any) {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  // if (keys1.length !== keys2.length) {
  //   return false;
  // }
  if (obj1["name"] !== obj2["name"]) {
    return false;
  }
  return true;
}

export const ProcessDataForFormUpdate = (oldValues: any, newValues: any) => {
  const differingValues = {};
  for (const key in oldValues) {
    if (key === "ingredients") {
      continue;
    }
    if (
      Object.prototype.hasOwnProperty.call(oldValues, key) &&
      Object.prototype.hasOwnProperty.call(newValues, key)
    ) {
      if (oldValues[key].toString() !== newValues[key]) {
        // @ts-expect-error:values coming from an api
        differingValues[key] = newValues[key];
      }
    }
  }

  return differingValues;
};
