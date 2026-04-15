import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_URL = process.env.API_URL ?? "http://localhost:3000/api";

function getToken() {
  return cookies().get("access_token")?.value ?? null;
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const token = getToken();
  const body = await request.json();
  const res = await fetch(`${API_URL}/tickets/${params.id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
