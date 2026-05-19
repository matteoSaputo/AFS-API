import { fail } from "../utils/response";
import { RouterConfig } from "../utils/types";
import type { Crud, Env, Webhook } from "../utils/types";

function checkIfId(pathname: string, basePath: string): boolean {
    const regex = new RegExp(`^/${basePath}/\\d+$`);
    return regex.test(pathname)
}

export async function crudRouter(
    request: Request,
    env: Env,
    config: RouterConfig<Crud>
) : Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const method = request.method

    const byId = checkIfId(pathname, config.path)

    if(method === "POST" && pathname === `/${config.path}`){
        return config.methods.create(request, env)
    }

    if(method === "GET"){
        if(byId){
            return config.methods.read(request, env)
        }

        if(pathname === `/${config.path}`){
            return config.methods.list(request, env)
        }
    }

    if(method === "PATCH" && byId){
        return config.methods.update(request, env)
    }

    if(method === "DELETE" && byId){
        return config.methods.delete(request, env)
    }

    return fail("Method or Endpoint Not Found", 404)
}

export async function webhookRouter(
    request: Request,
    env: Env,
    config: RouterConfig<Webhook>
): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const method = request.method

    if (method !== "POST") {
        return fail("Method Not Allowed", 405)
    }

    if (pathname == `/${config.path}`){
        return config.methods.handler(request, env)
    }

    return fail("Webhook Not Found", 404)
}