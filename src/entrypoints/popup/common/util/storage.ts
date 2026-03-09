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

    /**
     * 创建一个新的MiaoStorage实例
     * @example
     * const storage = new MiaoStorage('local', 'my-app');
     * const sessionStorage = new MiaoStorage('session');
     */
    constructor(storageType: 'local' | 'session' = 'local', namespace: string = 'default') {
        this.namespace = namespace;
        this.db = new MiaoDatabase(namespace);
    }

    /**
     * 对数据进行喵语言加密
     * @private
     * @example
     * const encrypted = this.encrypt('hello'); // 喵喵喵...
     */
    private encrypt(value: string): string {
        let encrypted = value;
        for (let i = 0; i < this.ENCRYPTION_TIMES; i++) {
            encrypted = Miao.encode(encrypted);
        }
        return encrypted;
    }

    /**
     * 对喵语言加密的数据进行解密
     * @private
     * @example
     * const decrypted = this.decrypt('喵喵喵...'); // 'hello'
     */
    private decrypt(value: string): string {
        let decrypted = value;
        for (let i = 0; i < this.ENCRYPTION_TIMES; i++) {
            decrypted = Miao.decode(decrypted);
        }
        return decrypted;
    }

    /**
     * 加密存储键名
     * @private
     */
    private encryptKey(key: string): string {
        return this.encrypt(key);
    }

    /**
     * 存储加密后的数据
     * @example
     * // 存储对象
     * storage.set('user', { name: '张三', age: 25 }, 30); // 30分钟后过期
     * 
     * // 存储字符串
     * storage.set('token', 'xxx-yyy-zzz', 60); // 60分钟后过期
     * 
     * // 存储数组
     * storage.set('todos', ['学习', '运动'], 120); // 120分钟后过期
     */
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

    /**
     * 获取并解密数据
     * @example
     * // 获取对象
     * const user = storage.get<{ name: string; age: number }>('user');
     * if (user) {
     *   console.log(user.name); // '张三'
     * }
     * 
     * // 获取字符串
     * const token = storage.get<string>('token');
     * 
     * // 获取数组
     * const todos = storage.get<string[]>('todos');
     */
    async get<T>(key: string): Promise<T | null> {
        const encryptedKey = this.encryptKey(key);
        const item = await this.db.items.get(encryptedKey);

        if (!item) return null;

        // 检查是否过期
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

    /**
     * 删除指定键的数据
     * @example
     * storage.remove('user'); // 删除用户数据
     * storage.remove('token'); // 删除token
     */
    async remove(key: string): Promise<void> {
        const encryptedKey = this.encryptKey(key);
        await this.db.items.delete(encryptedKey);
    }

    /**
     * 清空当前命名空间下的所有数据
     * @example
     * storage.clear(); // 清空所有数据
     */
    async clear(): Promise<void> {
        await this.db.items.clear();
    }

    /**
     * 添加存储事件监听器
     * @example
     * // 监听数据设置事件
     * storage.on('set', 'onDataSet');
     * 
     * // 监听数据删除事件
     * storage.on('remove', 'onDataRemove');
     * 
     * // 监听清空事件
     * storage.on('clear', 'onDataClear');
     * 
     * // 监听数据过期事件
     * storage.on('expired', 'onDataExpired');
     */
    on(event: 'set' | 'remove' | 'clear' | 'expired', callback: string): void {
        // 由于 IndexDB 的事件系统与之前不同，这里我们可以使用 Dexie 的 hook 系统
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
            // expired 事件需要在 get 操作时手动触发
        }
    }

    /**
     * 导出所有存储的数据（解密后的）
     * @param excludeKeys 要排除的键名数组
     * @returns 包含所有数据的对象
     * @example
     * // 导出所有数据，排除 'token' 和 'password'
     * const data = await storage.exportData(['token', 'password']);
     * console.log(data); // { user: {...}, settings: {...} }
     */
    async exportData(excludeKeys: string[] = []): Promise<Record<string, any>> {
        const result: Record<string, any> = {};
        const encryptedExcludeKeys = excludeKeys.map(key => this.encryptKey(key));

        // 获取所有未过期的数据
        const allItems = await this.db.items
            .where('key')
            .notEqual('')
            .filter(item => {
                // 过滤掉已过期的数据
                if (item.expires && Date.now() > item.expires) {
                    return false;
                }
                // 过滤掉被排除的键
                return !encryptedExcludeKeys.includes(item.key);
            })
            .toArray();

        // 解密所有数据
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

// 导出默认实例
export const miaoStorage = new MiaoStorage('local', 'browser-bookmark-tag');
