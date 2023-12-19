export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';


export class CustomRequest {
	host: string;
	path: string;
	method: Method;
	body?: any;
	query?: Record<string, any>;
	pathArgs?: Record<string, any>;
	headers?: Record<string, any>;
	timeout?: number;

	constructor(
		host: string,
		path: string,
		method: Method,
		body?: any,
		timeout: number = 30 * 1e3
	) {
		this.host = host;
		this.path = path;
		this.method = method;
		this.body = body;
		this.query = {};
		this.pathArgs = {};
		this.headers = {};
		this.timeout = timeout;
	}
}