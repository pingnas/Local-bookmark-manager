
export enum BgType {
    Default = 'default',
    Location = 'location',
    Internet = 'internet'
}


export class BgManager {
    type: BgType;
    config: BgConfig;

    constructor({ type, config }: {
        type: BgType,
        config: BgConfig,
    }) {
        this.type = type;
        this.config = config;
    }
}

export class ShowImageConfig {
    type: ResourceType;
    url: string;

    constructor({ type, url }: {
        type: ResourceType,
        url: string,
    }) {
        this.type = type;
        this.url = url;
    }
}

export class BgConfig {
    url?: string;
    code?: string;
    locationImages?: string[];
    locationHide?: boolean;
    locationImageIndex?: number;
    internetImages?: ShowImageConfig[];

    constructor({ url, code, locationImages = [], locationHide = false, locationImageIndex, internetImages = [] }: {
        url?: string,
        code?: string,
        locationImages?: string[],
        locationHide?: boolean,
        locationImageIndex?: number,
        internetImages?: ShowImageConfig[],
    }) {
        this.code = code;
        this.url = url;
        this.locationImages = locationImages;
        this.locationHide = locationHide;
        this.locationImageIndex = locationImageIndex;
        this.internetImages = internetImages;
    }
}

export enum ResourceType {
    Image = 'Image',
    Video = 'Video',
    Unknown = 'Unknown',
    Error = 'Error'
}
