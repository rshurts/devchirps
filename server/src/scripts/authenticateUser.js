import getToken from "../lib/getToken";

(async () => {
  // const [email, password] = process.argv.slice(2);
  const access_token = await getToken(
    process.env.EMAIL,
    process.env.PASSWORD
  ).catch((error) => {
    console.error(error);
  });
  console.log(access_token);
})();
