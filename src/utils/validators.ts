export const validatePhoneNumber = (phone: string): boolean => {
  return /^\d{10}$/.test(phone);
};

export const validateAmount = (amount: number): boolean => {
  return amount > 0 && amount <= 1000000;
};

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2 && name.trim().length <= 100;
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};