const APP_NAME = "parser_app";

export const addToSessionStorage = (key: string, value: string) => {
  const stored = sessionStorage.getItem(APP_NAME);
  const data = stored ? JSON.parse(stored) : {};

  const updated = { ...data, [key]: value };
  sessionStorage.setItem(APP_NAME, JSON.stringify(updated));

  console.log("Saved:", key, value, updated);
};

export const removeFromSessionStorage = (key: string) => {
  const stored = sessionStorage.getItem(APP_NAME);
  const data = stored ? JSON.parse(stored) : {};

  delete data[key];
  sessionStorage.setItem(APP_NAME, JSON.stringify(data));
};

export const getFromSessionStorage = (key: string) => {
  const stored = sessionStorage.getItem(APP_NAME);
  const data = stored ? JSON.parse(stored) : {};
  return data[key];
};
