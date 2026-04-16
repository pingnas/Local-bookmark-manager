import { createEventHook } from '@vueuse/core';
import type { VNode } from 'vue';

export interface DialogOpenPayload {
    id: string,
    slot: { default?: () => VNode, footer?: () => VNode, title?: string }
}

export interface DialogClosePayload {
    id: string,
}

export const DialogOpenService = createEventHook<DialogOpenPayload>()
export const DialogCloseService = createEventHook<DialogClosePayload>()
