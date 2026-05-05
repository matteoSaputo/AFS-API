import { fail } from "../utils/response";
import { RouterConfig } from "../utils/types";
import type { Env } from "../utils/types";

export async function Router(
    request: Request,
    env: Env,
    config: RouterConfig
) : Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const method = request.method

    const byId = checkIfId(pathname, config.path)

    if(method === "POST" && pathname === `/${config.path}`){
        return config.method_functions.create(request, env)
    }

    if(method === "GET"){
        if(byId){
            return config.method_functions.read(request, env)
        }

        if(pathname === `/${config.path}`){
            return config.method_functions.list(request, env)
        }
    }

    if(method === "PATCH" && byId){
        return config.method_functions.update(request, env)
    }

    if(method === "DELETE" && byId){
        return config.method_functions.delete(request, env)
    }

    return fail("Method or Endpoint Not Found", 404)
}

function checkIfId(pathname: string, basePath: string): boolean {
    const regex = new RegExp(`^/${basePath}/\\d+$`);
    return regex.test(pathname)
}