import { config } from "dotenv";
import { z } from "zod";

config({ path: ".env.local", override: true });
config();

function readArgument(name: string) {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

const inputSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.email().transform((value) => value.toLowerCase()),
  password: z.string().min(8, "Password must contain at least 8 characters"),
});

const input = inputSchema.safeParse({
  name: readArgument("name"),
  email: readArgument("email"),
  password: readArgument("password"),
});

if (!input.success) {
  console.error(z.prettifyError(input.error));
  console.error(
    '\nUsage: npm run create-user -- --name "Name" --email "name@example.com" --password "secure-password"',
  );
  process.exitCode = 1;
} else {
  const [{ createAuth }, { closeDatabaseConnection }] = await Promise.all([
    import("../src/lib/auth"),
    import("../src/db"),
  ]);

  try {
    const userCreationAuth = createAuth({ allowSignUp: true });

    const result = await userCreationAuth.api.signUpEmail({
      body: input.data,
    });

    console.log(`Created user ${result.user.email}.`);
  } catch (error) {
    console.error(
      error instanceof Error ? error.message : "Unable to create user.",
    );
    process.exitCode = 1;
  } finally {
    await closeDatabaseConnection();
  }
}
