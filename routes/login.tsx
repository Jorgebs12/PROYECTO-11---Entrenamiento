import Login from "../components/Login.tsx";
import { FreshContext, Handlers, RouteConfig } from "$fresh/server.ts";
import { setCookie } from "$std/http/cookie.ts";
import jwt from "jsonwebtoken";
export const config: RouteConfig = { skipInheritedLayouts: true };
export const handler: Handlers = {
    POST: async (req: Request, ctx: FreshContext) => {
        const url = new URL(req.url);
        const form = await req.formData();
        const username = form.get("username")?.toString() || "";
        const password = form.get("password")?.toString() || "";
        if (username === "a" && password === "a") {
            const token = jwt.sign({ username }, Deno.env.get("JWT_SECRET"), {
                expiresIn: "24h",
            });
            const headers = new Headers();
            setCookie(headers, {
                name: "auth",
                value: token,
                sameSite: "Lax",
                domain: url.hostname,
                path: "/",
                secure: true,
            });
            headers.set("location", "/");
            return new Response(null, { status: 303, headers });
        } else {
            return ctx.render();
        }
    },
};
const Page = () => <Login />;
export default Page;
