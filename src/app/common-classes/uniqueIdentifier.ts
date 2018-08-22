

export class UniqueIdentifier  {

    uri: string = "";
    name: string = "";

    constructor(options?: {uri:string, name:string})
    {
        if (options !== undefined) {
            this.uri =  options.uri;
            this.name = options.name;
        }
    }
}
