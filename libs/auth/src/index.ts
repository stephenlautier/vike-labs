import { Auth, createActionURL, setEnvDefaults } from "@auth/core";
import type { AuthConfig } from "@auth/core";
import Auth0 from "@auth/core/providers/auth0";
import CredentialsProvider from "@auth/core/providers/credentials";
import type { Session } from "@auth/core/types";
import { enhance } from "@universal-middleware/core";
import type { UniversalHandler, UniversalMiddleware } from "@universal-middleware/core";

const env: Record<string, string | undefined> = process?.env ?? {};

/**
 * Shared Auth.js configuration used by both the shell server (which serves
 * `/api/auth/**`) and the standalone API (which only verifies sessions).
 *
 * `secret` is read from `AUTH_SECRET`; in dev a fallback keeps the workspace
 * runnable but production deploys MUST set it.
 */
export const authjsConfig = {
	basePath: "/api/auth",
	trustHost: true,
	secret: env.AUTH_SECRET ?? "MY_SECRET",
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				username: { label: "Username", type: "text", placeholder: "jsmith" },
				password: { label: "Password", type: "password" },
			},
			async authorize() {
				const user = { id: "1", name: "J Smith", email: "jsmith@example.com" };
				return user ?? null;
			},
		}),

		Auth0({
			issuer: env.AUTH0_ISSUER_BASE_URL ?? "",
			clientId: env.AUTH0_CLIENT_ID ?? "",
			clientSecret: env.AUTH0_CLIENT_SECRET ?? "",
		}),
	],
} satisfies Omit<AuthConfig, "raw">;

export type RiftSession = Session;

/**
 * Retrieve the Auth.js session for a Request by re-issuing the
 * `/api/auth/session` lookup with the request's cookies. Returns `null` for
 * unauthenticated requests; throws on Auth.js error responses.
 */
export async function getSession(
	req: Request,
	config: Omit<AuthConfig, "raw"> = authjsConfig,
): Promise<RiftSession | null> {
	setEnvDefaults(process.env, config);
	const requestURL = new URL(req.url);
	const url = createActionURL("session", requestURL.protocol, req.headers, process.env, config);

	const response = await Auth(
		new Request(url, { headers: { cookie: req.headers.get("cookie") ?? "" } }),
		config,
	);
	const data: unknown = await response.json();

	if (!data || typeof data !== "object" || Object.keys(data).length === 0) {
		return null;
	}
	if (response.status === 200) {
		// oxlint-disable-next-line typescript/no-unsafe-type-assertion -- Auth.js session response validated by status code
		return data as RiftSession;
	}
	const message =
		"message" in data && typeof (data as { message: unknown }).message === "string"
			? String((data as { message: unknown }).message)
			: undefined;
	throw new Error(message);
}

/**
 * Universal middleware that adds `session` (Auth.js Session or null) to the
 * request context. Consumed by Vike via `pageContext.session`.
 */
export const authjsSessionMiddleware: UniversalMiddleware = enhance(
	async (request, context) => {
		try {
			return {
				...context,
				session: await getSession(request, authjsConfig),
			};
		} catch (error) {
			console.debug("authjsSessionMiddleware:", error);
			return {
				...context,
				session: null,
			};
		}
	},
	{
		name: "rift:authjs-middleware",
		immutable: false,
	},
);

/**
 * Auth.js HTTP handler — mounted by the shell at `/api/auth/**`.
 */
export const authjsHandler = enhance(async request => Auth(request, authjsConfig), {
	name: "rift:authjs-handler",
	path: "/api/auth/**",
	method: ["GET", "POST"],
	immutable: false,
}) satisfies UniversalHandler;
