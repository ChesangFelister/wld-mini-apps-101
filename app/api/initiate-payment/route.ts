import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// Changed the parameter name to _req since it's not being used
export async function POST(_req: NextRequest) {
  const uuid = crypto.randomUUID().replace(/-/g, "");
  // TODO: Store the ID field in your database so you can verify the payment later
  
  cookies().set({
    name: "payment-nonce",
    value: uuid,
    httpOnly: true,
  });
  
  console.log(uuid);
  return NextResponse.json({ id: uuid });
}
