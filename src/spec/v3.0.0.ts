// REFERENCE: https://spec.openapis.org/oas/v3.0.0.html

export class OpenAPIObject {
    openapi: string;
    info: InfoObject;
    servers?: Array<ServerObject>;
    paths: PathsObject;
    components?: ComponentsObject;
    security?: Array<SecurityRequirementObject>;
    tags?: Array<TagObject>;
    externalDocs?: ExternalDocumentationObject;
}

export class InfoObject {
    title: string;
    description?: string;
    termsOfService?: string;
    contact?: ContactObject;
    license?: LicenseObject;
    version: string;
}
  
export class ContactObject {
    name?: string;
    url?: string;
    email?: string;
}
  
export class LicenseObject {
    name: string;
    url?: string;
}
  
export class ServerObject {
    url: string;
    description?: string;
    variables?: Record<string, ServerVariableObject>;
}
  
export class ServerVariableObject {
    enum?: Array<string>;
    default: string;
    description?: string;
}
  
export class ComponentsObject {
    schemas?: Record<string, SchemaObject | ReferenceObject>;
    responses?: Record<string, ResponseObject | ReferenceObject>;
    parameters?: Record<string, ParameterObject | ReferenceObject>;
    examples?: Record<string, ExampleObject | ReferenceObject>;
    requestBodies?: Record<string, RequestBodyObject | ReferenceObject>;
    headers?: Record<string, HeaderObject | ReferenceObject>;
    securitySchemes?: Record<string, SecuritySchemeObject | ReferenceObject>;
    links?: Record<string, LinkObject | ReferenceObject>;
    callbacks?: Record<string, CallbackObject | ReferenceObject>;
}
  
export type PathsObject = Record<string, PathItemObject>;

export class PathItemObject {
    $ref?: string;
    summary?: string;
    description?: string;
    get?: OperationObject;
    put?: OperationObject;
    post?: OperationObject;
    delete?: OperationObject;
    options?: OperationObject;
    head?: OperationObject;
    patch?: OperationObject;
    trace?: OperationObject;
    servers?: Array<ServerObject>;
    parameters?: Array<ParameterObject | ReferenceObject>;
}
  
export class OperationObject {
    tags?: Array<string>;
    summary?: string;
    description?: string;
    externalDocs?: ExternalDocumentationObject;
    operationId?: string;
    parameters?: Array<ParameterObject | ReferenceObject>;
    requestBody?: RequestBodyObject | ReferenceObject;
    responses: ResponsesObject;
    callbacks?: CallbacksObject;
    deprecated?: boolean;
    security?: Array<SecurityRequirementObject>;
    servers?: Array<ServerObject>;
}
  
export class ExternalDocumentationObject {
    description?: string;
    url: string;
}
  
export class BaseParameterObject {
    description?: string;
    required?: boolean;
    deprecated?: boolean;
    allowEmptyValue?: boolean;
    style?: 'matrix' | 'label' | 'form' | 'simple' | 'spaceDelimited' | 'pipeDelimited' | 'deepObject';
    explode?: boolean;
    allowReserved?: boolean;
    schema?: SchemaObject | ReferenceObject;
    examples?: Record<string, ExampleObject | ReferenceObject>;
    example?: any;
    content?: Record<string, MediaTypeObject>;
}
  
export class ParameterObject extends BaseParameterObject {
    name: string;
    in: 'query' | 'header' | 'path' | 'cookie';
}
  
export class RequestBodyObject {
    description?: string;
    content: Record<string, MediaTypeObject>;
    required?: boolean;
}

export class MediaTypeObject {
    schema?: SchemaObject | ReferenceObject;
    example?: any;
    examples?: ExamplesObject;
    encoding?: EncodingObject;
}
  
export type EncodingObject = Record<string, EncodingPropertyObject>;

export class EncodingPropertyObject {
    contentType?: string;
    headers?: Record<string, HeaderObject | ReferenceObject>;
    style?: string;
    explode?: boolean;
    allowReserved?: boolean;
}
  
export class ResponsesObject {
    default?: ResponseObject | ReferenceObject;
}
  
export class ResponseObject {
    description: string;
    headers?: HeadersObject;
    content?: Record<string, MediaTypeObject>;
    links?: LinksObject;
}
  
export type CallbacksObject = Record<string, CallbackObject | ReferenceObject>;

export type CallbackObject = Record<string, PathItemObject>;

export type HeadersObject = Record<string, HeaderObject | ReferenceObject>;
  
export class ExampleObject {
    summary?: string;
    description?: string;
    value?: any;
    externalValue?: string;
}
  
export type LinksObject = Record<string, LinkObject | ReferenceObject>;

export class LinkObject {
    operationRef?: string;
    operationId?: string;
    parameters?: LinkParametersObject;
    requestBody?: any | string;
    description?: string;
    server?: ServerObject;
}
  
export type LinkParametersObject = Record<string, any>;

export type HeaderObject = BaseParameterObject;

export class TagObject {
    name: string;
    description?: string;
    externalDocs?: ExternalDocumentationObject;
}
  
export type ExamplesObject = Record<string, ExampleObject | ReferenceObject>;
  
export class ReferenceObject {
    $ref: string;
}
  
export class SchemaObject {
    nullable?: boolean;
    discriminator?: DiscriminatorObject;
    readOnly?: boolean;
    writeOnly?: boolean;
    xml?: XmlObject;
    externalDocs?: ExternalDocumentationObject;
    example?: any;
    examples?: Array<any> | Record<string, any>;
    deprecated?: boolean;
    type?: string;
    allOf?: Array<SchemaObject | ReferenceObject>;
    oneOf?: Array<SchemaObject | ReferenceObject>;
    anyOf?: Array<SchemaObject | ReferenceObject>;
    not?: SchemaObject | ReferenceObject;
    items?: SchemaObject | ReferenceObject;
    properties?: Record<string, SchemaObject | ReferenceObject>;
    additionalProperties?: SchemaObject | ReferenceObject | boolean;
    patternProperties?: SchemaObject | ReferenceObject | any;
    description?: string;
    format?: string;
    default?: any;
    title?: string;
    multipleOf?: number;
    maximum?: number;
    exclusiveMaximum?: boolean;
    minimum?: number;
    exclusiveMinimum?: boolean;
    maxLength?: number;
    minLength?: number;
    pattern?: string;
    maxItems?: number;
    minItems?: number;
    uniqueItems?: boolean;
    maxProperties?: number;
    minProperties?: number;
    required?: Array<string>;
    enum?: Array<any>;
}
  
export type SchemasObject = Record<string, SchemaObject>;
  
export class DiscriminatorObject {
    propertyName: string;
    mapping?: Record<string, string>;
}
  
export class XmlObject {
    name?: string;
    namespace?: string;
    prefix?: string;
    attribute?: boolean;
    wrapped?: boolean;
}
  
export class SecuritySchemeObject {
    type: 'apiKey' | 'http' | 'oauth2' | 'openIdConnect';
    description?: string;
    name: string;
    in: 'query' | 'header' | 'cookie';
    scheme: string;
    bearerFormat?: string;
    flows: OAuthFlowsObject;
    openIdConnectUrl: string;
}
  
export class OAuthFlowsObject {
    implicit?: OAuthFlowObject;
    password?: OAuthFlowObject;
    clientCredentials?: OAuthFlowObject;
    authorizationCode?: OAuthFlowObject;
}
  
export class OAuthFlowObject {
    authorizationUrl: string;
    tokenUrl: string;
    refreshUrl?: string;
    scopes: Record<string, any>;
}
  
export type SecurityRequirementObject = Record<string, Array<string>>;