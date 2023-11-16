export const masker = {
  builder: {
    phone: phoneBuilder
  }
}

function phoneBuilder(value: string) {
  if (value.length > 11) return '+55 (99) 9999-9999';
  return '+55 (99) 99999-9999';
}