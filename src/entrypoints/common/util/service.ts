import { Subject } from "rxjs";
import { BgConfig, BgType } from ".";

/**
 * 更新 setBgModel 的服务
 */
export const updateModelService = new Subject<{}>()

/**
 * 更新 setBgTempelte 的服务
 */
export const setBgTempelteService = new Subject<{ x: BgType, }>()

/**
 * 删除 history 记录的服务
 */
export const delService = new Subject<{ x: BookmarkTreeNode, key: string }>()


/**
 * 弹窗打开
 */
export const DialogOpenService = new Subject<{ id: string, slot: { default?: () => VNode, footer?: () => VNode, title?: string } }>()
export const DialogCloseService = new Subject<{ id: string, }>()

/** newtab 背景加载好了 */
export const newTabBgInitSerice = new Subject<{}>()