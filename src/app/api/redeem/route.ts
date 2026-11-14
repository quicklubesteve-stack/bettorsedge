import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { redeemPromoCode } from "@/lib/promo";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in to redeem a promotional code." },
        { status: 401 }
      );
    }

    const { code } = await req.json();
    if (!code || typeof code !== "string" || code.trim().length === 0) {
      return NextResponse.json({ error: "Please provide a valid code." }, { status: 400 });
    }

    const ipAddress = req.headers.get("x-forwarded-for") || req.ip || "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || "unknown";

    const result = await redeemPromoCode({
      codeString: code,
      userId: user.id,
      ipAddress,
      userAgent,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Redemption error:", error);
    const msg = error.message;

    if (msg === "INVALID_CODE") {
      return NextResponse.json(
        { error: "The promotional code you entered is invalid." },
        { status: 400 }
      );
    }
    if (msg === "CODE_INACTIVE" || msg === "CODE_NOT_STARTED") {
      return NextResponse.json(
        { error: "This promotional code is currently inactive or not yet active." },
        { status: 400 }
      );
    }
    if (msg === "CODE_EXPIRED") {
      return NextResponse.json(
        { error: "This promotional code has expired." },
        { status: 400 }
      );
    }
    if (msg === "REDEMPTION_LIMIT_REACHED") {
      return NextResponse.json(
        { error: "This promotional code has reached its maximum redemption limit." },
        { status: 400 }
      );
    }
    if (msg === "ALREADY_REDEEMED") {
      return NextResponse.json(
        { error: "You have already redeemed this promotional gift code on your account." },
        { status: 400 }
      );
    }
    if (msg === "EMAIL_NOT_AUTHORIZED") {
      return NextResponse.json(
        { error: "This promotional code is restricted to a specific recipient email address." },
        { status: 403 }
      );
    }
    if (msg === "NEW_USERS_ONLY") {
      return NextResponse.json(
        { error: "This promotional code is reserved for new users only." },
        { status: 400 }
      );
    }
    if (msg === "TOO_MANY_ATTEMPTS") {
      return NextResponse.json(
        { error: "Too many failed redemption attempts. Please wait a minute before trying again." },
        { status: 429 }
      );
    }

    return NextResponse.json({ error: "Failed to redeem promotional code." }, { status: 500 });
  }
}
