"use strict";
//import dotenv from "dotenv";
//dotenv.config();
Object.defineProperty(exports, "__esModule", { value: true });
// const result = dotenv.config();
// if (result.error) {
//   throw result.error;
// }
// const { parsed: envp } = result;
// export const environment2 = envp;
exports.environment = {
    endpoint: process.env.API_URL,
    masterKey: process.env.API_KEY,
    port: process.env.PORT
};
//# sourceMappingURL=environment.js.map