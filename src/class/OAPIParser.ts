import 'reflect-metadata';
import { plainToClass } from 'class-transformer';
import { CustomRequest, Method } from '../class/CustomRequest';
import { OpenAPIObject, OperationObject, ParameterObject, PathItemObject, ReferenceObject, RequestBodyObject } from '../spec/v3.0.0';
import { logger } from '../utils';


export class OAPIParser {
    spec: any;
    openAPIObject: OpenAPIObject;
    
    // @TODO: read from spec
    host: string;

    constructor(spec: any, host: string) {
        this.spec = spec;
        this.host = host;
        // @TODO: check spec version and select
    }

    parse() {
        const version: string = this.spec.openapi;

        switch (version) {
            case '3.0.0':
                this.openAPIObject = plainToClass(OpenAPIObject, this.spec);
                break;
            default:
                throw new TypeError('unsupported OAPI version');
        }
    }

    genCustomRequestList(): Array<CustomRequest> {
        let res: Array<CustomRequest> = [];

        for (const pathKey in this.openAPIObject.paths) {
            const pathObj: PathItemObject = this.openAPIObject.paths[pathKey];

            // @TODO: impl
            const pathResList = [
                this.PathItem2CustomRequest(this.host, pathKey, 'GET', pathObj.get),
                // this.PathItem2CustomRequest(this.host, pathKey, 'POST', pathObj.post),
                // this.PathItem2CustomRequest(this.host, pathKey, 'PUT', pathObj.put),
                // this.PathItem2CustomRequest(this.host, pathKey, 'DELETE', pathObj.delete),
                // this.PathItem2CustomRequest(this.host, pathKey, 'PATCH', pathObj.patch)
            ].filter(obj => !!obj);

            res = res.concat(pathResList);
        }

        return res;
    }

    private isParameterObject(obj: ParameterObject | ReferenceObject): obj is ParameterObject {
        return (obj as ParameterObject).hasOwnProperty('in');
    }

    private PathItem2CustomRequest(
        host: string,
        path: string,
        method: Method,
        p: OperationObject
    ): CustomRequest {
        if (p === null || p === undefined) { return null; }
        const res = new CustomRequest(host, path, method);

        for (const params of p.parameters) {

            if (this.isParameterObject(params)) {
                switch (params.in) {
                    case 'cookie':
                        break;
                    case 'header':
                        break;
                    case 'path':
                        res.pathArgs[params.name] = undefined;
                        break;
                    case 'query':
                        // @TODO: process optional params
                        if (params.required) {
                            res.query[params.name] = undefined;
                        }
                        break;
                }
            }
        }

        // @TODO: handle body
        if (!!p.requestBody && p.requestBody instanceof RequestBodyObject) {

        }

        return res;
    }
}