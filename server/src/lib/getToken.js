import fetch from "node-fetch";
import { URLSearchParams } from "url";

export default async function getToken(username, password) {
  const params = new URLSearchParams([
    ["audience", process.env.AUTH0_AUDIENCE],
    ["client_id", process.env.AUTH0_CLIENT_ID_GRAPHQL],
    ["client_secret", process.env.AUTH0_CLIENT_SECRET_GRAPHQL],
    ["grant_type", "http://auth0.com/oauth/grant-type/password-realm"],
    ["password", password],
    ["realm", "Username-Password-Authentication"],
    ["scope", "openid"],
    ["username", username],
  ]);

  const response = await fetch(
    `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
    { method: "POST", body: params }
  ).catch((error) => {
    throw new Error(error);
  });
  const body = await response.json();
  const { access_token } = body;

  if (!access_token) {
    throw new Error(body.error_description || "Cannot retrieve access token.");
  }

  return access_token;
}
