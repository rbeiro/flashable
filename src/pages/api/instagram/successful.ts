/* eslint-disable */
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.query.code) {
    const INSTAGRAM_AUTHORIZATION_CODE = req.query.code as string;
    console.log(INSTAGRAM_AUTHORIZATION_CODE);

    const form = new URLSearchParams();

    form.append("client_id", process.env.INSTAGRAM_CLIENT_ID!);
    form.append("client_secret", process.env.INSTAGRAM_CLIENT_SECRET!);
    form.append("grant_type", "authorization_code");
    form.append(
      "redirect_uri",
      "https://localhost:3001/api/instagram/successful"
    );
    form.append("code", INSTAGRAM_AUTHORIZATION_CODE);

    await axios({
      method: "POST",
      url: "https://api.instagram.com/oauth/access_token",
      data: form,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((response) => {
        console.log(response.data.access_token);
        return res.status(200).send(JSON.stringify(response.data.access_token));
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).send(
          JSON.stringify({
            error:
              "Não autorizado ou erro ao acessar a Api, verifique o console",
          })
        );
      });
  }

  if (req.query.INSTAGRAM_ROUTE_SECRET !== process.env.INSTAGRAM_ROUTE_SECRET) {
    console.log("funcionou");
    return res.status(401).send("You are note authorized to call this API");
  }
  return res.status(200).send("Parabeins");
}
