export class ProfileSpec {
    name: string;
    desc?: string;
    data?: Record<string, ProfileObject>;
    headers?: Record<string, string>;
}

class ProfileObject {
    desc?: string;
    alias?: Array<string>;
    value: Record<string, ProfileObject> | any;
}