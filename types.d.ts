declare global {
  namespace App {
    interface Locals {
      runtime: {
        env: Env;
      };
    }
  }
}
export {};
