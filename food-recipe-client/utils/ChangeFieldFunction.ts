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
