import axios from "@/utils/axios";
import { config } from "@/utils/config";
import { NextRequest, NextResponse } from "next/server";

// Helper to convert JS object to x-www-form-urlencoded
function toFormUrlEncoded(data: Record<string, string>) {
  return Object.entries(data)
    .map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`)
    .join("&");
}

export async function POST(req: NextRequest) {
  try {
    // Parse request body for login credentials
    const body = await req.json();
    const { username, password } = body;

    // Step 1: GET session cookie
    const sessionInitRes = await axios.get(`${config.API_URL}/clubs/10000/login`);
    const cookies = sessionInitRes.headers["set-cookie"];

    let sessionCookieValue: string | null = null;

    if (cookies) {
      const sessionCookie = cookies.find((c) => c.includes("USSQ-API-SESSION"));
      if (sessionCookie) {
        const match = sessionCookie.match(/USSQ-API-SESSION=([^;]+)/);
        if (match) {
          sessionCookieValue = decodeURIComponent(match[1]);
        }
      }
    }

    if (!sessionCookieValue) {
      return NextResponse.json(
        { success: false, message: "Session cookie not found" },
        { status: 500 }
      );
    }

    // Step 2: POST login with form data
    const formData = toFormUrlEncoded({ username, password });

    const loginResponse = await axios.post(
      `${config.API_URL}/clubs/10000/login`,
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Referer: "https://clublocker.com",
          Cookie: `USSQ-API-SESSION=${encodeURIComponent(sessionCookieValue)}`,
        },
      }
    );

    const res = NextResponse.json(
      {
        success: true,
        message: "Login successful",
        data: loginResponse.data,
      },
      { status: 200 }
    );

    // Set the session cookie for frontend if needed
    res.cookies.set("USSQ-API-SESSION", sessionCookieValue, {
    });

    return res;
  } catch (error: any) {
    console.error("Login error:", error?.response?.data || error.message);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
