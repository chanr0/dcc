// capitalize capitalizes the first character in the string (nurse -> Nurse)
export const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

export const deepCopyArray = (array: any) => {
  return JSON.parse(JSON.stringify(array));
}