/* eslint-disable */
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import emailjs from "@emailjs/nodejs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.query.code) {
    const INSTAGRAM_AUTHORIZATION_CODE = req.query.code as string;

    const form = new URLSearchParams();

    form.append("client_id", process.env.INSTAGRAM_CLIENT_ID!);
    form.append("client_secret", process.env.INSTAGRAM_CLIENT_SECRET!);
    form.append("grant_type", "authorization_code");
    form.append("redirect_uri", "https://rbeiro.com/api/instagram/successful");
    form.append("code", INSTAGRAM_AUTHORIZATION_CODE);

    await axios({
      method: "POST",
      url: "https://api.instagram.com/oauth/access_token",
      data: form,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then(async (response) => {
        console.log("PRIMEIRO REQUEST: ");
        console.log(response.data);
        const form = new URLSearchParams();

        form.append("grant_type", "ig_exchange_token");
        form.append("client_secret", process.env.INSTAGRAM_CLIENT_SECRET!);
        form.append("access_token", response.data.access_token);

        await axios
          .get("https://graph.instagram.com/access_token", {
            params: {
              grant_type: "ig_exchange_token",
              client_secret: process.env.INSTAGRAM_CLIENT_SECRET!,
              access_token: response.data.access_token,
            },
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          })
          .then((response) => {
            console.log(response.data);
            const templateParam = {
              subject:
                "Sucesso na autenticação de usuário no Instagram Basic Display",
              from_where: "Instagram Authentication Flashable",
              from_name: "botzin",
              message: response.data.access_token,
              from_email: "nenhum",
            };

            emailjs
              .send("service_w55rfy9", "template_zt653tl", templateParam, {
                publicKey: process.env.NEXT_PUBLIC_EMAILJS_KEY!,
                privateKey: process.env.EMAILJS_PRIVATE_KEY!,
              })
              .then((response) => {
                console.log(response);
                return res
                  .status(response.status)
                  .send(
                    JSON.stringify({ sucesso: "Deu tudo certo, obrigado!" })
                  );
              })
              .catch((err) => {
                console.log(err);
                return res
                  .status(err.status)
                  .send(JSON.stringify({ error: err.text }));
              });
          })
          .catch((err) => console.log(err));

        // await axios({
        //   method: "GET",
        //   url: "https://graph.instagram.com/access_token",
        //   data: form,
        //   headers: {
        //     "Content-Type": "application/x-www-form-urlencoded",
        //   },
        // })
        //   .then((response) => {
        //     console.log("SEGUNDO REQUEST: +");
        //     console.log(response.data);
        //   })
        //   .catch((err) => {
        //     console.log(err);
        //     return res.status(err.response.data.code).send(
        //       JSON.stringify({
        //         error: err.response.data.error_message,
        //       })
        //     );
        //   });
      })
      .catch((err) => {
        console.log(err.response.data);
        return res.status(err.response.data.code).send(
          JSON.stringify({
            error: err.response.data.error_message,
          })
        );
      });
  }
}
