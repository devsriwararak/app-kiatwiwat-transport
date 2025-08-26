import NextAuth, { AuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

async function refreshAccessToken(token: JWT): Promise<JWT> {
    try {
        console.log("Attempting to refresh access token...");

        // **สำคัญ:** เปลี่ยน URL นี้เป็น Endpoint /refreshtoken ของคุณ
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/auth/v1/refresh`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                refresh_token: token.refreshToken,
            }),
        });

        // **แก้ไข:** ตรวจสอบว่า response สำเร็จหรือไม่
        if (response.ok) {
            const refreshedTokens = await response.json();
            console.log("Access token refreshed successfully.");
            // คืนค่า token ที่ได้รับการ refresh ใหม่
            console.log({token_2:refreshedTokens.access_token });
            return {
                ...token,
                accessToken: refreshedTokens.access_token,
                accessTokenExpires: Date.now() + 15 * 1000, // 15 วินาที
                refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
                error: undefined, // ล้าง error เก่าทิ้ง
            };
        }
        // **แก้ไข:** ถ้า response ไม่สำเร็จ (เช่น refresh token หมดอายุ) ให้คืนค่า error
        console.error("Failed to refresh access token. Status:", response.status);
        return {
            ...token,
            error: "RefreshAccessTokenError",
        };

    } catch (error) {
        console.error("Error in refreshAccessToken function:", error);
        // กรณีเกิด Network error หรืออื่นๆ
        return {
            ...token,
            error: "RefreshAccessTokenError",
        };
    }
}

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            // ฟังก์ชันนี้จะถูกเรียกเมื่อมีการ signIn
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    return null;
                }
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/auth/v1/login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            username: credentials.username,
                            password: credentials.password,
                        }),
                    });


                    if (res.ok) {
                        const userFromApi = await res.json();
                        console.log({token_1:userFromApi.access_token });
                        
                        // console.log("User authorized successfully:", userFromApi);
                        return {
                            id: credentials.username, // ใช้ username เป็น id ชั่วคราว หรือจะ decode จาก token ก็ได้
                            name: credentials.username,
                            role_id: userFromApi.role_id,
                            accessToken: userFromApi.access_token,
                            refreshToken: userFromApi.refresh_token,
                            expiresIn: 15, // 15 วินาที 
                        };
                    }
                    return null;

                } catch (error) {
                    console.error("Authorize error:", error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        // Callback นี้จะถูกเรียกหลังจาก authorize สำเร็จ
        async jwt({ token, user }) {
            // 1. ครั้งแรกที่ Login (object `user` จะถูกส่งมา)
            if (user) {
                token.accessToken = user.accessToken;
                token.refreshToken = user.refreshToken;
                token.accessTokenExpires = Date.now() + user.expiresIn * 1000;
                token.role_id = user.role_id;
                token.id = user.id;
                return token;
            }

            // 2. ครั้งต่อๆ ไปที่เข้ามา (เช็ค session)
            // ตรวจสอบว่า Access Token หมดอายุหรือยัง
            if (Date.now() < (token.accessTokenExpires as number)) {
                // ถ้ายังไม่หมดอายุ ก็คืนค่า token เดิม
                return token;
            }

            // 3. ถ้า Access Token หมดอายุแล้ว ให้เรียกฟังก์ชัน refresh
            console.log("refreshing.............");
            return refreshAccessToken(token);
        },

        // Callback นี้จะถูกเรียกเพื่อสร้าง object session ที่จะส่งให้ Client
        async session({ session, token }) {
            // ส่งข้อมูลจาก token ไปที่ session
            if (token) {
                session.user.id = token.id as string;
                session.user.role_id = token.role_id as number;
                session.accessToken = token.accessToken as string;
                session.error = token.error as string;
            }
            return session;
        },
    },
    pages: {
        signIn: '/auth/sign-in', // บอก NextAuth ว่าหน้า Login ของเราอยู่ที่ไหน
    },
    session: {
        strategy: "jwt", // เราจะใช้ JWT ในการจัดการ Session
    },
    secret: process.env.NEXTAUTH_SECRET, // Secret key สำหรับ NextAuth
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
