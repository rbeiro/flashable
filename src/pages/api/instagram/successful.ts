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
      .then((response) => {
        const templateParam = {
          subject:
            "Sucesso na autenticação de usuário no Instagram Basic Display",
          from_where: "Instagram Authentication Flashable",
          from_name: "botzin",
          message: response.data.access_token,
          from_email: "nenhum",
        };
        console.log(process.env.NEXT_PUBLIC_EMAILJS_KEY);
        emailjs
          .send("service_w55rfy9", "template_zt653tl", templateParam, {
            publicKey: process.env.NEXT_PUBLIC_EMAILJS_KEY!,
            privateKey: process.env.EMAILJS_PRIVATE_KEY!,
          })
          .then((response) => {
            console.log(response);
            return res
              .status(response.status)
              .send(JSON.stringify({ sucesso: "Deu tudo certo, obrigado!" }));
          })
          .catch((err) => {
            console.log(err);
            return res
              .status(err.status)
              .send(JSON.stringify({ error: err.text }));
          });
      })
      .catch((err) => {
        console.log(err);
        return res.status(err.data.code).send(
          JSON.stringify({
            error: err.data.error_message,
          })
        );
      });
  }
}
