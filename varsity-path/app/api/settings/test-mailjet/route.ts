import { NextResponse } from "next/server"

export async function POST() {
  const apiKey    = process.env.MAILJET_API_KEY
  const secretKey = process.env.MAILJET_SECRET_KEY

  if (!apiKey || !secretKey) {
    return NextResponse.json(
      { error: "MAILJET_API_KEY ou MAILJET_SECRET_KEY manquant dans .env" },
      { status: 400 }
    )
  }

  const credentials = Buffer.from(`${apiKey}:${secretKey}`).toString("base64")

  const res = await fetch("https://api.mailjet.com/v3/REST/apikey", {
    headers: { Authorization: `Basic ${credentials}` },
  })

  if (!res.ok) {
    return NextResponse.json({ error: "Clés invalides" }, { status: 401 })
  }

  return NextResponse.json({ ok: true })
}
