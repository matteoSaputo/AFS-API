import { businessRouter } from "./routes/businesses";
import { debugRouter } from "./routes/debug";
import { healthRouter } from "./routes/health";

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);
		const pathname = url.pathname;

		// ======== Businesses ==========
		if (pathname.startsWith("/businesses")) {
			return businessRouter(request, env);
		}

		// ======== DB Health ==========
		if(pathname.startsWith("/health")) {
			return healthRouter(request, env);
		}

		// ======== Debug ==========
		if(pathname.startsWith("/debug")) {
			return debugRouter(request, env);
		}

		return new Response("Not Found", {
			status: 404
		});
	},
} satisfies ExportedHandler<Env>;
