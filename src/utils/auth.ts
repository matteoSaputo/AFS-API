import { fail } from "./response";
import { Env } from "./types";

export function requireApiKey(
    request: Request,
    env: Env
): Response | null {
    const apiKey = request.headers.get("api-key")

    if(!apiKey || apiKey !== env.API_KEY){
        return fail("Unauthorized", 401)
    }

    return null
}

