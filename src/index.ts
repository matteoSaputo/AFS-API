import { fail } from "node:assert";
import { businessRouter } from "./routes/businesses";
import { debugRouter } from "./routes/debug";
import { healthRouter } from "./routes/health";
import { industryRouter } from "./routes/industries";

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);
		const pathname = url.pathname;

		if(pathname === "/"){
			return Response.json({
				ok: true,
				service: "AFS API",
				status: "running"
			})
		}

		// ======== Businesses ==========
		if (pathname.startsWith("/businesses")) {
			return businessRouter(request, env);
		}

		// ======== Industries ==========
		if(pathname.startsWith("/industries")) {
			return industryRouter(request, env)
		}

		// ======== DB Health ==========
		if(pathname.startsWith("/health")) {
			return healthRouter(request, env);
		}

		// ======== Debug ==========
		if(pathname.startsWith("/debug")) {
			return debugRouter(request, env);
		}

		// return fail(`Endpoint Not Found, URL: ${url}`);
		return fail("Endpoint Not Found");
	},
} satisfies ExportedHandler<Env>;
