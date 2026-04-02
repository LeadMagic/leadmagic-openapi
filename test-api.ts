import fs from "node:fs/promises";
import https from "node:https";
import path from "node:path";
import readline from "node:readline";

const BASE_URL = "api.leadmagic.io";
const REQUEST_TIMEOUT_MS = 20_000;
const TEST_COMPANY_NAME =
	process.env.LEADMAGIC_TEST_COMPANY_NAME ?? "LeadMagic";
const TEST_COMPANY_DOMAIN =
	process.env.LEADMAGIC_TEST_COMPANY_DOMAIN ?? "leadmagic.io";
const TEST_WORK_EMAIL =
	process.env.LEADMAGIC_TEST_WORK_EMAIL ?? "jesse@leadmagic.io";
const TEST_PROFILE_URL =
	process.env.LEADMAGIC_TEST_PROFILE_URL ??
	"https://profiles.example.com/test-user";
const TEST_AD_URL =
	process.env.LEADMAGIC_TEST_AD_URL ??
	"https://ads.example.com/library/detail/633872143";

type HttpMethod = "GET" | "POST";
type TestGroup = "credits" | "people" | "companies" | "jobs" | "ads";
type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonObject | JsonValue[];
type JsonObject = { [key: string]: JsonValue };
type SummaryPath = string[];

interface TestCase {
	group: TestGroup;
	name: string;
	method: HttpMethod;
	path: string;
	payload?: JsonObject;
	summaryLabel: string;
	summaryPaths: SummaryPath[];
	allowNoResult?: boolean;
}

interface ResponseData {
	statusCode: number;
	headers: Record<string, string | string[] | undefined>;
	body: JsonValue;
}

interface TestResult {
	test: TestCase;
	ok: boolean;
	response?: ResponseData;
	error?: string;
}

interface CliOptions {
	group?: TestGroup;
	reportPath?: string;
}

interface ReportEntry {
	group: TestGroup;
	name: string;
	method: HttpMethod;
	path: string;
	ok: boolean;
	statusCode?: number;
	bodyKeys?: string[];
	bodyKind?: string;
	summary?: JsonValue;
	creditsConsumed?: JsonValue;
	remainingCreditsHeader?: string;
	preview?: JsonValue;
	error?: string;
}

interface ReportFile {
	generatedAt: string;
	baseUrl: string;
	selectedGroup: TestGroup | "all";
	totals: {
		total: number;
		passed: number;
		failed: number;
	};
	results: ReportEntry[];
}

const tests: TestCase[] = [
	{
		group: "credits",
		name: "Check Credits",
		method: "GET",
		path: "/v1/credits",
		summaryLabel: "Credits",
		summaryPaths: [["credits"]],
	},
	{
		group: "people",
		name: "Email Validation",
		method: "POST",
		path: "/v1/people/email-validation",
		payload: { email: TEST_WORK_EMAIL },
		summaryLabel: "Email Status",
		summaryPaths: [["email_status"], ["message"]],
		allowNoResult: true,
	},
	{
		group: "people",
		name: "Email Finder",
		method: "POST",
		path: "/v1/people/email-finder",
		payload: {
			first_name: "Jesse",
			last_name: "Ouellette",
			domain: TEST_COMPANY_DOMAIN,
		},
		summaryLabel: "Finder Status",
		summaryPaths: [["status"], ["message"]],
		allowNoResult: true,
	},
	{
		group: "people",
		name: "Personal Email Finder",
		method: "POST",
		path: "/v1/people/personal-email-finder",
		payload: { profile_url: TEST_PROFILE_URL },
		summaryLabel: "Personal Email",
		summaryPaths: [["personal_email"], ["first_personal_email"], ["message"]],
		allowNoResult: true,
	},
	{
		group: "people",
		name: "B2B Profile Email",
		method: "POST",
		path: "/v1/people/b2b-profile-email",
		payload: { profile_url: TEST_PROFILE_URL },
		summaryLabel: "Work Email",
		summaryPaths: [["email"], ["message"]],
		allowNoResult: true,
	},
	{
		group: "people",
		name: "Email To B2B Profile",
		method: "POST",
		path: "/v1/people/b2b-profile",
		payload: { work_email: TEST_WORK_EMAIL },
		summaryLabel: "Profile URL",
		summaryPaths: [["profile_url"], ["message"]],
		allowNoResult: true,
	},
	{
		group: "people",
		name: "Mobile Finder",
		method: "POST",
		path: "/v1/people/mobile-finder",
		payload: { work_email: TEST_WORK_EMAIL },
		summaryLabel: "Mobile Number",
		summaryPaths: [["mobile_number"], ["message"]],
		allowNoResult: true,
	},
	{
		group: "people",
		name: "Profile Search",
		method: "POST",
		path: "/v1/people/profile-search",
		payload: { profile_url: TEST_PROFILE_URL },
		summaryLabel: "Profile",
		summaryPaths: [["full_name"], ["professional_title"], ["message"]],
		allowNoResult: true,
	},
	{
		group: "people",
		name: "Role Finder",
		method: "POST",
		path: "/v1/people/role-finder",
		payload: {
			job_title: "Software Engineer",
			company_name: TEST_COMPANY_NAME,
		},
		summaryLabel: "Role Match",
		summaryPaths: [["full_name"], ["job_title"], ["message"]],
		allowNoResult: true,
	},
	{
		group: "people",
		name: "Employee Finder",
		method: "POST",
		path: "/v1/people/employee-finder",
		payload: {
			company_name: TEST_COMPANY_NAME,
			limit: 3,
		},
		summaryLabel: "Total Count",
		summaryPaths: [["total_count"], ["returned_count"], ["message"]],
		allowNoResult: true,
	},
	{
		group: "companies",
		name: "Company Search",
		method: "POST",
		path: "/v1/companies/company-search",
		payload: { company_domain: TEST_COMPANY_DOMAIN },
		summaryLabel: "Company",
		summaryPaths: [["company_name"], ["companyName"], ["message"]],
		allowNoResult: true,
	},
	{
		group: "companies",
		name: "Company Funding",
		method: "POST",
		path: "/v1/companies/company-funding",
		payload: { company_domain: TEST_COMPANY_DOMAIN },
		summaryLabel: "Funding Company",
		summaryPaths: [["company_name"], ["basicInfo", "companyName"], ["message"]],
		allowNoResult: true,
	},
	{
		group: "jobs",
		name: "Jobs Finder",
		method: "POST",
		path: "/v1/jobs/jobs-finder",
		payload: {
			company_name: TEST_COMPANY_NAME,
			page: 1,
			per_page: 3,
		},
		summaryLabel: "Total Jobs",
		summaryPaths: [["total_count"], ["message"]],
		allowNoResult: true,
	},
	{
		group: "jobs",
		name: "Job Countries",
		method: "GET",
		path: "/v1/jobs/countries",
		summaryLabel: "Response Kind",
		summaryPaths: [],
	},
	{
		group: "jobs",
		name: "Job Types",
		method: "GET",
		path: "/v1/jobs/job-types",
		summaryLabel: "Response Kind",
		summaryPaths: [],
	},
	{
		group: "ads",
		name: "Google Ads Search",
		method: "POST",
		path: "/v1/ads/google-ads-search",
		payload: { company_domain: TEST_COMPANY_DOMAIN },
		summaryLabel: "Ads Count",
		summaryPaths: [["ads_count"], ["message"]],
		allowNoResult: true,
	},
	{
		group: "ads",
		name: "Meta Ads Search",
		method: "POST",
		path: "/v1/ads/meta-ads-search",
		payload: { company_domain: TEST_COMPANY_DOMAIN },
		summaryLabel: "Ads Count",
		summaryPaths: [["ads_count"], ["message"]],
		allowNoResult: true,
	},
	{
		group: "ads",
		name: "B2B Ads Search",
		method: "POST",
		path: "/v1/ads/b2b-ads-search",
		payload: { company_domain: TEST_COMPANY_DOMAIN },
		summaryLabel: "Ads Count",
		summaryPaths: [["ads_count"], ["message"]],
		allowNoResult: true,
	},
	{
		group: "ads",
		name: "B2B Ad Details",
		method: "POST",
		path: "/v1/ads/b2b-ads-details",
		payload: { ad_url: TEST_AD_URL },
		summaryLabel: "Ad Detail",
		summaryPaths: [["headline"], ["message"]],
		allowNoResult: true,
	},
];

function isObject(value: JsonValue | undefined): value is JsonObject {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isGroup(value: string): value is TestGroup {
	return ["credits", "people", "companies", "jobs", "ads"].includes(value);
}

function parseArgs(argv: string[]): CliOptions {
	const options: CliOptions = {};

	for (let index = 0; index < argv.length; index += 1) {
		const arg = argv[index];

		if (arg === "--group") {
			const group = argv[index + 1];
			if (!group || !isGroup(group)) {
				throw new Error(
					"Invalid --group value. Use one of: credits, people, companies, jobs, ads.",
				);
			}

			options.group = group;
			index += 1;
			continue;
		}

		if (arg === "--report") {
			const reportPath = argv[index + 1];
			if (!reportPath) {
				throw new Error(
					"Missing value for --report. Example: --report reports/smoke-test.json",
				);
			}

			options.reportPath = reportPath;
			index += 1;
			continue;
		}

		if (arg === "--help" || arg === "-h") {
			printHelp();
			process.exit(0);
		}

		throw new Error(`Unknown argument: ${arg}`);
	}

	return options;
}

function printHelp(): void {
	console.log("LeadMagic OpenAPI smoke test");
	console.log("");
	console.log("Usage: npm run test:api -- [--group <group>] [--report <path>]");
	console.log("");
	console.log("Groups: credits, people, companies, jobs, ads");
	console.log("");
	console.log("Examples:");
	console.log("  npm run test:api");
	console.log("  npm run test:api -- --group people");
	console.log(
		"  npm run test:api -- --group companies --report reports/companies.json",
	);
}

function makeRequest(
	apiKey: string,
	pathname: string,
	data: JsonObject | undefined,
	method: HttpMethod,
): Promise<ResponseData> {
	return new Promise((resolve, reject) => {
		const hasBody = method !== "GET" && data !== undefined;
		const body = hasBody ? JSON.stringify(data) : "";

		const options: https.RequestOptions = {
			hostname: BASE_URL,
			port: 443,
			path: pathname,
			method,
			timeout: REQUEST_TIMEOUT_MS,
			headers: {
				"X-API-Key": apiKey,
				Accept: "application/json",
			},
		};

		if (hasBody) {
			options.headers = {
				...options.headers,
				"Content-Type": "application/json",
				"Content-Length": Buffer.byteLength(body),
			};
		}

		const req = https.request(options, (res) => {
			let responseText = "";

			res.on("data", (chunk: Buffer) => {
				responseText += chunk.toString("utf8");
			});

			res.on("end", () => {
				let parsedBody: JsonValue = responseText;

				try {
					parsedBody = JSON.parse(responseText) as JsonValue;
				} catch {
					// Keep raw text for non-JSON responses.
				}

				resolve({
					statusCode: res.statusCode ?? 0,
					headers: res.headers,
					body: parsedBody,
				});
			});
		});

		req.on("timeout", () => {
			req.destroy(new Error(`Request timed out after ${REQUEST_TIMEOUT_MS}ms`));
		});

		req.on("error", reject);

		if (hasBody) {
			req.write(body);
		}

		req.end();
	});
}

function pickValue(
	body: JsonValue,
	paths: SummaryPath[],
): JsonValue | undefined {
	for (const currentPath of paths) {
		let current: JsonValue | undefined = body;
		let found = true;

		for (const key of currentPath) {
			if (!isObject(current) || !(key in current)) {
				found = false;
				break;
			}

			current = current[key];
		}

		if (found && current !== undefined && current !== null) {
			return current;
		}
	}

	return undefined;
}

function getBodyKeys(body: JsonValue): string[] {
	return isObject(body) ? Object.keys(body) : [];
}

function shallowPreview(body: JsonObject): JsonObject {
	const preview: JsonObject = {};

	for (const [key, value] of Object.entries(body).slice(0, 8)) {
		if (Array.isArray(value)) {
			preview[key] = `[${value.length} item(s)]`;
			continue;
		}

		if (isObject(value)) {
			preview[key] = "{...}";
			continue;
		}

		preview[key] = value;
	}

	return preview;
}

function compactPreview(body: JsonValue): JsonValue {
	if (Array.isArray(body)) {
		if (body.length === 0) {
			return [];
		}

		const firstItem = body[0];
		if (!isObject(firstItem)) {
			return body.slice(0, 3);
		}

		return [shallowPreview(firstItem)];
	}

	if (!isObject(body)) {
		return body;
	}

	return shallowPreview(body);
}

function getCreditsConsumed(body: JsonValue): JsonValue | undefined {
	return pickValue(body, [["credits_consumed"]]);
}

function getRemainingCreditsHeader(response: ResponseData): string | undefined {
	const remaining = response.headers["x-credits-remaining"];
	return remaining !== undefined ? String(remaining) : undefined;
}

function getBodyKind(body: JsonValue): string {
	if (Array.isArray(body)) {
		return "array";
	}

	return typeof body;
}

function buildResponseSnapshot(test: TestCase, response: ResponseData) {
	return {
		bodyKeys: getBodyKeys(response.body),
		bodyKind: getBodyKind(response.body),
		summary: pickValue(response.body, test.summaryPaths),
		creditsConsumed: getCreditsConsumed(response.body),
		remainingCreditsHeader: getRemainingCreditsHeader(response),
		preview: compactPreview(response.body),
	};
}

function isSuccessfulResponse(test: TestCase, response: ResponseData): boolean {
	if (response.statusCode < 200 || response.statusCode >= 300) {
		return false;
	}

	if (!test.allowNoResult) {
		return true;
	}

	return pickValue(response.body, test.summaryPaths) !== undefined;
}

function summarizeResponse(test: TestCase, response: ResponseData): void {
	const body = response.body;
	const snapshot = buildResponseSnapshot(test, response);

	console.log(`   ✅ HTTP ${response.statusCode}`);

	if (Array.isArray(body)) {
		console.log(`   📦 Array response with ${body.length} item(s)`);
	} else if (snapshot.bodyKeys.length > 0) {
		console.log(`   🧩 Fields: ${snapshot.bodyKeys.join(", ")}`);
	} else {
		console.log(`   🧾 Body type: ${snapshot.bodyKind}`);
	}

	if (snapshot.summary !== undefined) {
		console.log(`   🔎 ${test.summaryLabel}: ${String(snapshot.summary)}`);
	}

	if (snapshot.creditsConsumed !== undefined) {
		console.log(`   💰 Credits Consumed: ${String(snapshot.creditsConsumed)}`);
	}

	if (snapshot.remainingCreditsHeader !== undefined) {
		console.log(
			`   🪙 Credits Remaining Header: ${snapshot.remainingCreditsHeader}`,
		);
	}

	console.log(`   📄 Preview: ${JSON.stringify(snapshot.preview)}`);
}

function promptForSecret(promptText: string): Promise<string> {
	return new Promise((resolve, reject) => {
		if (!process.stdin.isTTY || !process.stdout.isTTY) {
			reject(
				new Error(
					"Set LEADMAGIC_API_KEY or run this script in an interactive terminal to enter it securely.",
				),
			);
			return;
		}

		const stdin = process.stdin;
		const stdout = process.stdout;
		const originalRawMode = stdin.isRaw;
		let secret = "";

		readline.emitKeypressEvents(stdin);
		stdin.setRawMode(true);
		stdin.resume();
		stdout.write(promptText);

		const cleanup = () => {
			stdin.removeListener("keypress", onKeypress);
			stdin.setRawMode(Boolean(originalRawMode));
			stdout.write("\n");
		};

		const onKeypress = (character: string, key: readline.Key) => {
			if (key.ctrl && key.name === "c") {
				cleanup();
				reject(new Error("Input cancelled."));
				return;
			}

			if (key.name === "return" || key.name === "enter") {
				cleanup();
				resolve(secret.trim());
				return;
			}

			if (key.name === "backspace") {
				if (secret.length > 0) {
					secret = secret.slice(0, -1);
					stdout.write("\b \b");
				}
				return;
			}

			if (!character) {
				return;
			}

			secret += character;
			stdout.write("*");
		};

		stdin.on("keypress", onKeypress);
	});
}

async function resolveApiKey(): Promise<string> {
	if (process.env.LEADMAGIC_API_KEY) {
		return process.env.LEADMAGIC_API_KEY;
	}

	const apiKey = await promptForSecret(
		"Enter LeadMagic API key (input hidden): ",
	);
	if (!apiKey) {
		throw new Error("An API key is required to run the smoke tests.");
	}

	return apiKey;
}

async function runTest(apiKey: string, test: TestCase): Promise<TestResult> {
	try {
		const response = await makeRequest(
			apiKey,
			test.path,
			test.payload,
			test.method,
		);
		const ok = isSuccessfulResponse(test, response);

		return {
			test,
			ok,
			response,
			error: ok
				? undefined
				: "Response completed but did not produce the expected output shape.",
		};
	} catch (error) {
		return {
			test,
			ok: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

function createReportEntry(result: TestResult): ReportEntry {
	const snapshot =
		result.response !== undefined
			? buildResponseSnapshot(result.test, result.response)
			: undefined;

	return {
		group: result.test.group,
		name: result.test.name,
		method: result.test.method,
		path: result.test.path,
		ok: result.ok,
		statusCode: result.response?.statusCode,
		bodyKeys: snapshot?.bodyKeys,
		bodyKind: snapshot?.bodyKind,
		summary: snapshot?.summary,
		creditsConsumed: snapshot?.creditsConsumed,
		remainingCreditsHeader: snapshot?.remainingCreditsHeader,
		preview: snapshot?.preview,
		error: result.error,
	};
}

async function writeReport(
	reportPath: string,
	selectedGroup: TestGroup | "all",
	results: TestResult[],
): Promise<void> {
	const passed = results.filter((result) => result.ok).length;
	const report: ReportFile = {
		generatedAt: new Date().toISOString(),
		baseUrl: `https://${BASE_URL}`,
		selectedGroup,
		totals: {
			total: results.length,
			passed,
			failed: results.length - passed,
		},
		results: results.map(createReportEntry),
	};

	const resolvedPath = path.resolve(process.cwd(), reportPath);
	await fs.mkdir(path.dirname(resolvedPath), { recursive: true });
	await fs.writeFile(
		resolvedPath,
		`${JSON.stringify(report, null, 2)}\n`,
		"utf8",
	);
	console.log(`📝 Report written to ${resolvedPath}`);
}

async function testEndpoints(
	apiKey: string,
	options: CliOptions,
): Promise<void> {
	const results: TestResult[] = [];
	const selectedTests = options.group
		? tests.filter((test) => test.group === options.group)
		: tests;

	if (selectedTests.length === 0) {
		throw new Error("No tests selected.");
	}

	console.log("🧪 Testing LeadMagic API Endpoints\n");
	console.log(`🎯 Scope: ${options.group ?? "all"}\n`);

	for (const [index, test] of selectedTests.entries()) {
		console.log(
			`${index + 1}. Testing ${test.name} (${test.method} ${test.path})...`,
		);
		const result = await runTest(apiKey, test);
		results.push(result);

		if (result.response) {
			summarizeResponse(test, result.response);
		}

		if (!result.ok) {
			console.log(`   ❌ ${result.error}`);
		}

		console.log("");
	}

	const passed = results.filter((result) => result.ok).length;
	const failed = results.length - passed;

	console.log(
		`🎉 API Testing Complete: ${passed}/${results.length} tests passed.`,
	);
	console.log(`📊 Failed: ${failed}`);
	console.log(
		"📝 This script validates the current documented /v1/... routes, not the older unversioned path layout.",
	);
	console.log(
		"💡 Placeholder inputs can still return legitimate no-result responses, so the output preview is the main inspection aid.",
	);

	if (options.reportPath) {
		await writeReport(options.reportPath, options.group ?? "all", results);
	}

	if (failed > 0) {
		process.exitCode = 1;
	}
}

async function main(): Promise<void> {
	const options = parseArgs(process.argv.slice(2));
	const apiKey = await resolveApiKey();
	await testEndpoints(apiKey, options);
}

main().catch((error: unknown) => {
	console.error("❌ Unhandled error while testing endpoints");
	console.error(error instanceof Error ? error.message : String(error));
	process.exitCode = 1;
});
