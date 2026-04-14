import { sendTelegram } from "@/lib/telegram"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { nombre, email, telefono, mensaje } = await request.json()

  if (!nombre || !email || !mensaje) {
    return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 })
  }

  await sendTelegram(
    `📩 *Nuevo mensaje de contacto*\n\n` +
    `👤 *Nombre:* ${nombre}\n` +
    `📧 *Email:* ${email}\n` +
    `📱 *Telefono:* ${telefono || "no indicado"}\n` +
    `💬 *Mensaje:* ${mensaje}`
  )

  return NextResponse.json({ ok: true })
}
