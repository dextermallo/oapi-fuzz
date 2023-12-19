import { ProfileSpec, CustomRequest } from "../class";
import { logger } from "../utils";

export interface ITestCase {
	id: number;
	name: string;
	desc?: string;
	checkStatusCode?(statusCode: number): void;
	checkBody?(body: any): void;
	requestRenderer?(req: CustomRequest): CustomRequest;
	profileRenderer?(req: CustomRequest, objProfile: ProfileSpec, subjProfile?: ProfileSpec): CustomRequest;
}

export const TestCaseList: Array<ITestCase> = [
	{	
		id: 1,
		name: 'NO_MINIMUM_AUTHENTICATION',
		desc: "No bearer should receive statusCode = 4**",
		checkStatusCode: ((statusCode: number) => {
			if (!statusCode.toString().startsWith('4')) {
				logger.error('1-fail')
			}
		}),
		profileRenderer: ((req: CustomRequest, objProfile: ProfileSpec): CustomRequest => {
			setPathArgByProfile(req, objProfile);
			setHeaderArgByProfile(req, objProfile);
			return req;
		})
	},
	{
		id: 2,
		name: 'NO_AUTHENTICATION_BYPASS_PRIVILEGE',
		desc: 'one user should only available to access its own resources, and/or resources should be limited to specific identities (authentication-level)',
		checkStatusCode: ((statusCode: number) => {
			if (!statusCode.toString().startsWith('4')) {
				logger.error('2-fail')
			}
		})
	},
	{
		id: 3,
		name: "AUTHENTICATED_BYPASS_PRIVILEGE",
		desc: "one user should only available to access its own resources, and/or resources should be limited to specific identities (authorization-level)",
		checkStatusCode: ((statusCode: number) => {
			if (!statusCode.toString().startsWith('4')) {
				logger.error('3-fail')
			}
		})
	},
	{
		id: 4,
		name: "DISCLOSE_SENSITIVE_PII", 
		desc: "sensitive PII should be disclosed at minimize"
	},
	{
		id: 5,
		name: "DISCLOSE_SENSITIVE_SYSTEM_INFO",
		desc: "sensitive system information should be disclosed at minimize"
	}
]

const setPathArgByProfile = (req: CustomRequest, profile: ProfileSpec) => {
	for (const arg in req.pathArgs) {
		req.pathArgs[arg] = profile.data[arg].value;
	}
}

const setHeaderArgByProfile = (req: CustomRequest, profile: ProfileSpec) => {
	for (const header in req.headers) {
		req.headers[header] = profile.headers[header];
	}
}