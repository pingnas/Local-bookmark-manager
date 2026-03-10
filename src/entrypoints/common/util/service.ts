import { Subject } from "rxjs";

export const DialogOpenService = new Subject<{ id: string, slot: { default?: () => VNode, footer?: () => VNode, title?: string } }>()
export const DialogCloseService = new Subject<{ id: string, }>()

