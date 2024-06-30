interface CompareObjects {
  (objOne: Object, objTwo: Object): {
    isSame: boolean;
  };
}

export const compareObjects: CompareObjects = (objOne, objTwo) => {
  if (!objOne || !objTwo) {
    return { isSame: false };
  }
  const parsedObjOneKeys = Object.keys(objOne);
  const parsedObjTwoKeys = Object.keys(objTwo);

  const parsedObjOneValues = Object.values(objOne);
  const parsedObjTwoValues = Object.values(objTwo);

  const equalValues = parsedObjOneValues.every((value) =>
    parsedObjTwoValues.includes(value)
  );
  const equalKeys = parsedObjOneKeys.every((value) =>
    parsedObjTwoKeys.includes(value)
  );

  if (equalValues && equalKeys) {
    return {
      isSame: true,
    };
  }

  return {
    isSame: false,
  };
};
