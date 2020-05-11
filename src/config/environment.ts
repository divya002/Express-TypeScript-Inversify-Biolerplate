//import dotenv from "dotenv";
//dotenv.config();

// const result = dotenv.config();
// if (result.error) {
//   throw result.error;
// }
// const { parsed: envp } = result;
// export const environment2 = envp;

export const environment = {
  endpoint: process.env.API_URL,
  masterKey: process.env.API_KEY,
  port: process.env.PORT
};

