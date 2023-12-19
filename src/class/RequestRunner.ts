import * as fs from 'fs';
import * as path from 'path';
import { ITestCase, TestCaseList } from '../test/TestCase';
import { logger } from '../utils/logger';
import { CustomRequest } from './CustomRequest';
import { plainToClass } from 'class-transformer';
import { ProfileSpec } from './ProfileSpec';

const req = require('request');


export class RequestRunner {
    request: CustomRequest;
    readonly testCaseList: Array<ITestCase>;
    readonly saveResponse: boolean;
    readonly outputPath: string;
	readonly profiles: Array<ProfileSpec>;
	readonly profilePath: string;

    constructor(
        request: CustomRequest,
        testCaseList: Array<ITestCase> = TestCaseList,
		profilePath: string,
        saveResponse: boolean,
        outputPath: string
    ) {
        this.request = request;
        this.testCaseList = testCaseList;
		this.profilePath = profilePath;
        this.saveResponse = saveResponse;
        this.outputPath = outputPath;
		this.profiles = [];
		this.loadProfile();
    }

	private loadProfile() {
		const fileList = fs.readdirSync(this.profilePath).filter(file => path.extname(file) === '.json');

		fileList.forEach(file => {
			const fileData = fs.readFileSync(path.join(this.profilePath, file));
			const json = JSON.parse(fileData.toString());
			this.profiles.push(plainToClass(ProfileSpec, json));
		});
	}

    async exec() {
		for (let i = 0; i < this.profiles.length; ++i) {
			for (let j = i + 1; j < this.profiles.length; ++j) {
				for (let testCase of this.testCaseList) {

					let replicaReq = this.request;
					if (!!testCase.requestRenderer) {
						replicaReq = testCase.requestRenderer(this.request);
					}

					if (!!testCase.profileRenderer) {
						replicaReq = testCase.profileRenderer(this.request, this.profiles[0], this.profiles[1]);
					}

					const resp = await this.execCustomRequest(replicaReq);
		
					if (this.saveResponse) {
						this.saveJson(this.genOutputFilename(testCase), resp.body);
					}
		
					logger.verbose(JSON.stringify(resp));
		
					if (!!testCase.checkBody) {
						testCase.checkBody(resp.body);
					}
					
					if (!!testCase.checkStatusCode) {
						testCase.checkStatusCode(resp.statusCode);
					}
				}
			}
		}
    }

    async execCustomRequest(r: CustomRequest) {
		if (!!r.pathArgs) {
			for (const key in r.pathArgs) {
				r.path = r.path.replace(`{${key}}`, r.pathArgs[key]);
			}
		}

		// replace `//` to `/` if pathArgs are empty
		r.path = r.path.replace(/\/\//gi, "/");

		const res: Record<string, any> = {
			'method': r.method,
			'url': `${r.host}${r.path}`,
			'headers': r.headers
		}

		if (res.method === 'GET' && !!r.body) { throw TypeError('GET request cannot have body'); }

		if (!!r.body) { res['body'] = JSON.stringify(r.body); }
		if (!!r.query) {			
			res.url += '?';
			for (const key in r.query) {
				res.url += `${key}=${r.query[key]}&`
			}
			res.url = res.url.slice(0, -1);
		}

		return await this.__request(res, res.timeout);
	}

	private async __request(options: Record<string, any>, timeout: number): Promise<{ body: any; statusCode: number }> {
		logger.verbose(JSON.stringify(options));
		return new Promise((resolve, reject) => {
			req(options, timeout, (error: any, response: any) => {
				if (error) {
					reject(new Error(error));
				} else {
					resolve({ body: response.body, statusCode: response.statusCode });
				}
			});
		});
	}

    private saveJson(filename: string, data: any) {
		try {
			fs.writeFileSync(filename, JSON.stringify(JSON.parse(data), null, 4), { encoding: 'utf8', flag: 'wx' });
		} catch (err: any) {
			if (err.code === 'EEXIST') {
			  	logger.error('File already exists. Use a different filename or handle it accordingly.');
			} else {
				logger.error('Error saving JSON to file:', err);
			}
		}
	}

	private genOutputFilename(testcase: ITestCase): string {
		const path = `${this.outputPath}/${this.request.path}/${this.request.method}`;
		const filename = `${testcase.name}.json`;
		fs.mkdirSync(path, { recursive: true });
        return `${path}/${filename}`;
    }
}