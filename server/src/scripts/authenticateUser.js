import getToken from "../lib/getToken";

(async () => {
  const [emailArg, passwordArg] = process.argv.slice(2);
  const email = emailArg || process.env.EMAIL;
  const password = passwordArg || process.env.PASSWORD;
  const access_token = await getToken(email, password).catch((error) => {
    console.error(error);
  });
  console.log(access_token);
})();
