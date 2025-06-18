const map = new Map();
const localNameMap = new Map();

export class Registry {
    static useLocalName(localName: any, name: any) {
        if (localNameMap.has(name)) {
            throw new Error(`Custom template with name ${name} already exists`);
        }
        localNameMap.set(name, localName);
    }

    static getLocalName(name: any) {
        if (localNameMap.has(name)) {
            return localNameMap.get(name);
        }
        return name;
    }

    static add(name: any, template: any) {
        if (map.has(name)) {
            throw new Error(`Template with name ${name} already exists`);
        }
        map.set(name, template);
    }

    static lookup(name: any) {
        return map.get(name);
    }
}