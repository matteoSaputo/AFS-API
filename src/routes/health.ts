import { fail } from "../utils/response";


export async function healthRouter(
    request: Request,
    env: Env
): Promise<Response> {
    const url = new URL(request.url);

    if(url.pathname === "/health") {
        const hasHyperdrive = !!env.HYPERDRIVE;
        return Response.json({
            ok : true,
            hasHyperdrive
        });
    }

    return fail("Not Found", 404)
}