import { businessRouter } from "./routes/businesses";
import { debugRouter } from "./routes/debug";
import { healthRouter } from "./routes/health";
import { industryRouter } from "./routes/industries";
import { merchantRouter } from "./routes/merchants";
import { officesRouter } from "./routes/offices";
import { fail } from "./utils/response";

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
			return industryRouter(request, env);
		}

		// ======== Merchants ===========
		if(pathname.startsWith("/merchants")) {
			return merchantRouter(request, env);
		}

		// ======== Offices ===========
		if(pathname.startsWith("/offices")) {
			return officesRouter(request, env);
		}

		// // ======== Data Sources ===========
		// if(pathname.startsWith("/data_sources")) {
		// 	return merchantRouter(request, env);
		// }

		// // ======== Lenders ===========
		// if(pathname.startsWith("/lenders")) {
		// 	return merchantRouter(request, env);
		// }

		// // ======== Conditional Guidelines ===========
		// if(pathname.startsWith("/conditional_guidelines")) {
		// 	return merchantRouter(request, env);
		// }
		
		// // ======== Packages ===========
		// if(pathname.startsWith("/packages")) {
		// 	return merchantRouter(request, env);
		// }

		// // ======== Deals ===========
		// if(pathname.startsWith("/deals")) {
		// 	return merchantRouter(request, env);
		// }

		// // ======== Submissions ===========
		// if(pathname.startsWith("/submissions")) {
		// 	return merchantRouter(request, env);
		// }

		// // ======== Offers ===========
		// if(pathname.startsWith("/offers")) {
		// 	return merchantRouter(request, env);
		// }

		// // ======== Fundings ===========
		// if(pathname.startsWith("/fundings")) {
		// 	return merchantRouter(request, env);
		// }

		// // ======== Contracts ===========
		// if(pathname.startsWith("/contracts")) {
		// 	return merchantRouter(request, env);
		// }

		// // ======== Assignments ===========
		// if(pathname.startsWith("/assignments")) {
		// 	return merchantRouter(request, env);
		// }

		// ======== DB Health ==========
		if(pathname.startsWith("/health")) {
			return healthRouter(request, env);
		}

		// ======== Debug ==========
		if(pathname.startsWith("/debug")) {
			return debugRouter(request, env);
		}

		return fail(`Endpoint Not Found, URL: ${url}`);
	},
} satisfies ExportedHandler<Env>;
