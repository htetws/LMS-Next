import { Stripe } from "stripe";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

export const POST = async (req: Request) => {
  const body = await req.text();
  const signature = headers().get("stripe-signature") as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.log("[WEBHOOK_ERROR]", error);
    return NextResponse.json({ message: "Webhook error!" }, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const userId = session?.metadata?.userId;
  const courseId = session?.metadata?.courseId;

  if (event.type === "checkout.session.completed") {
    if (!userId || !courseId) {
      return NextResponse.json(
        { message: "Webhook error : Missing metadata" },
        { status: 400 }
      );
    }

    await db.purchase.create({
      data: {
        userId,
        courseId,
      },
    });
  } else {
    return NextResponse.json(
      { message: `Webhook error : Unhandled event type ${event.type}` },
      { status: 200 }
    );
  }

  return NextResponse.json({ status: 200 });
};
