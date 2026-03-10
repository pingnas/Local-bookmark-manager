import Dexie from 'dexie';
import Miao from 'miao-lang';

interface StorageItem {
    key: string;
    value: string;
    expires?: number;
}

class MiaoDatabase extends Dexie {
    items!: Dexie.Table<StorageItem, string>;

    constructor(namespace: string) {
        super(namespace);
        this.version(1).stores({
            items: 'key,value,expires'
        });
    }
}

export class MiaoStorage {
    private db: MiaoDatabase;
    private readonly ENCRYPTION_TIMES = 1;
    private namespace: string;

    constructor(storageType: 'local' | 'session' = 'local', namespace: string = 'default') {
        this.namespace = namespace;
        this.db = new MiaoDatabase(namespace);
    }

    private encrypt(value: string): string {
        let encrypted = value;
        for (let i = 0; i < this.ENCRYPTION_TIMES; i++) {
            encrypted = Miao.encode(encrypted);
        }
        return encrypted;
    }

    private decrypt(value: string): string {
        let decrypted = value;
        for (let i = 0; i < this.ENCRYPTION_TIMES; i++) {
            decrypted = Miao.decode(decrypted);
        }
        return decrypted;
    }

    private encryptKey(key: string): string {
        return this.encrypt(key);
    }

    async set<T>(key: string, value: T, expirationInMinutes?: number): Promise<void> {
        const encryptedKey = this.encryptKey(key);
        const stringValue = JSON.stringify(value);
        const encryptedValue = this.encrypt(stringValue);

        const expires = expirationInMinutes
            ? Date.now() + expirationInMinutes * 60 * 1000
            : undefined;

        await this.db.items.put({
            key: encryptedKey,
            value: encryptedValue,
            expires
        });
    }

    async get<T>(key: string): Promise<T | null> {
        const encryptedKey = this.encryptKey(key);
        const item = await this.db.items.get(encryptedKey);

        if (!item) return null;

        if (item.expires && Date.now() > item.expires) {
            await this.remove(key);
            return null;
        }

        try {
            const decryptedValue = this.decrypt(item.value);
            return JSON.parse(decryptedValue) as T;
        } catch (error) {
            console.error('解密或解析数据时出错:', error);
            return null;
        }
    }

    async remove(key: string): Promise<void> {
        const encryptedKey = this.encryptKey(key);
        await this.db.items.delete(encryptedKey);
    }

    async clear(): Promise<void> {
        await this.db.items.clear();
    }

    on(event: 'set' | 'remove' | 'clear' | 'expired', callback: string): void {
        switch (event) {
            case 'set':
                this.db.items.hook('creating').subscribe(() => {
                    if (typeof (window as any)[callback] === 'function') {
                        (window as any)[callback]();
                    }
                });
                break;
            case 'remove':
                this.db.items.hook('deleting').subscribe(() => {
                    if (typeof (window as any)[callback] === 'function') {
                        (window as any)[callback]();
                    }
                });
                break;
            case 'clear':
                this.db.items.hook('clearing').subscribe(() => {
                    if (typeof (window as any)[callback] === 'function') {
                        (window as any)[callback]();
                    }
                });
                break;
        }
    }

    async exportData(excludeKeys: string[] = []): Promise<Record<string, any>> {
        const result: Record<string, any> = {};
        const encryptedExcludeKeys = excludeKeys.map(key => this.encryptKey(key));

        const allItems = await this.db.items
            .where('key')
            .notEqual('')
            .filter(item => {
                if (item.expires && Date.now() > item.expires) {
                    return false;
                }
                return !encryptedExcludeKeys.includes(item.key);
            })
            .toArray();

        for (const item of allItems) {
            try {
                const decryptedKey = this.decrypt(item.key);
                const decryptedValue = this.decrypt(item.value);
                result[decryptedKey] = JSON.parse(decryptedValue);
            } catch (error) {
                console.error(`解密数据时出错 (key: ${item.key}):`, error);
            }
        }

        return result;
    }
}

export const miaoStorage = new MiaoStorage('local', 'browser-bookmark-tag');
