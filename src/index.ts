import { assignmentRouter } from "./routes/assignments";
import { businessRouter } from "./routes/businesses";
import { conditionalGuidelinesRouter } from "./routes/conditional_guidelines";
import { contractRouter } from "./routes/contracts";
import { dataSourceRouter } from "./routes/data_sources";
import { dealRouter } from "./routes/deals";
import { debugRouter } from "./routes/debug";
import { employeeRouter } from "./routes/employees";
import { fundingRouter } from "./routes/fundings";
import { healthRouter } from "./routes/health";
import { industryRouter } from "./routes/industries";
import { lenderRouter } from "./routes/lenders";
import { merchantRouter } from "./routes/merchants";
import { offerRouter } from "./routes/offers";
import { officesRouter } from "./routes/offices";
import { packageRouter } from "./routes/packages";
import { submissionRouter } from "./routes/submissions";
import { requireApiKey } from "./utils/auth";
import { fail } from "./utils/response";
import type { Env } from "./utils/types";

export default {
	async fetch(
		request: Request, 
		env: Env, 
		ctx: ExecutionContext
	): Promise<Response> {
		const url = new URL(request.url);
		const pathname = url.pathname;

		if(pathname === "/"){
			return Response.json({
				ok: true,
				service: "AFS API",
				status: "running"
			})
		}

		// ======== DB Health ==========
		if(pathname.startsWith("/health")) {
			return healthRouter(request, env);
		}

		// Beloe Routes are protected by API KEY
		const authError = requireApiKey(request, env);
		if(authError) return authError

		// ======== Debug ==========
		if(pathname.startsWith("/debug")) {
			return debugRouter(request, env);
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

		// ======== Data Sources ===========
		if(pathname.startsWith("/data_sources")) {
			return dataSourceRouter(request, env);
		}

		// ======== Lenders ===========
		if(pathname.startsWith("/lenders")) {
			return lenderRouter(request, env);
		}

		// ======== Conditional Guidelines ===========
		if(pathname.startsWith("/conditional_guidelines")) {
			return conditionalGuidelinesRouter(request, env);
		}
		
		// ======== Packages ===========
		if(pathname.startsWith("/packages")) {
			return packageRouter(request, env);
		}

		// ======== Deals ===========
		if(pathname.startsWith("/deals")) {
			return dealRouter(request, env);
		}

		// ======== Submissions ===========
		if(pathname.startsWith("/submissions")) {
			return submissionRouter(request, env);
		}

		// ======== Offers ===========
		if(pathname.startsWith("/offers")) {
			return offerRouter(request, env);
		}

		// ======== Fundings ===========
		if(pathname.startsWith("/fundings")) {
			return fundingRouter(request, env);
		}

		// ======== Contracts ===========
		if(pathname.startsWith("/contracts")) {
			return contractRouter(request, env);
		}

		// ======== Employees ===========
		if(pathname.startsWith("/employees")) {
			return employeeRouter(request, env);
		}

		// ======== Assignments ===========
		if(pathname.startsWith("/assignments")) {
			return assignmentRouter(request, env);
		}

		return fail(`Endpoint Not Found, URL: ${url}`);
	},
} satisfies ExportedHandler<Env>;
