"use client";

import * as React from "react";
import { Toast as ToastPrimitive } from "@base-ui/react/toast";
import {
  CheckCircleIcon,
  InfoIcon,
  WarningCircleIcon,
  XIcon,
} from "@phosphor-icons/react";

import { cn } from "@/lib/utils";

type ToastVariant = "success" | "error" | "info";

const toastManager = ToastPrimitive.createToastManager<{
  variant?: ToastVariant;
}>();

export const toast = {
  success: (title: string, description?: string) =>
    toastManager.add({ title, description, data: { variant: "success" } }),
  error: (title: string, description?: string) =>
    toastManager.add({ title, description, data: { variant: "error" } }),
  info: (title: string, description?: string) =>
    toastManager.add({ title, description, data: { variant: "info" } }),
};

const toastIcons: Record<ToastVariant, React.ElementType> = {
  success: CheckCircleIcon,
  error: WarningCircleIcon,
  info: InfoIcon,
};

const toastIconClasses: Record<ToastVariant, string> = {
  success: "text-emerald-500",
  error: "text-destructive",
  info: "text-primary",
};

function ToastList() {
  const { toasts } = ToastPrimitive.useToastManager<{
    variant?: ToastVariant;
  }>();

  return toasts.map((t) => {
    const variant = t.data?.variant;
    const Icon = variant ? toastIcons[variant] : undefined;

    return (
      <ToastPrimitive.Root
        key={t.id}
        toast={t}
        className={cn(
          "[--gap:0.75rem] [--height:var(--toast-frontmost-height,var(--toast-height))] [--offset-y:calc(var(--toast-offset-y)*-1+calc(var(--toast-index)*var(--gap)*-1)+var(--toast-swipe-movement-y))] [--peek:0.75rem] [--scale:calc(max(0,1-(var(--toast-index)*0.1)))] [--shrink:calc(1-var(--scale))]",
          "bg-popover text-popover-foreground ring-foreground/10 absolute right-0 bottom-0 left-auto z-[calc(1000-var(--toast-index))] w-full origin-bottom overflow-hidden rounded-lg shadow-2xl ring-1 select-none",
          "h-[var(--height)] data-expanded:h-[var(--toast-height)]",
          "[transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--peek))-(var(--shrink)*var(--height))))_scale(var(--scale))]",
          "data-expanded:[transform:translateX(var(--toast-swipe-movement-x))_translateY(var(--offset-y))]",
          "data-starting-style:[transform:translateY(150%)]",
          "[transition:transform_0.4s_cubic-bezier(0.22,1,0.36,1),opacity_0.4s,height_0.15s]",
          "data-ending-style:opacity-0 data-limited:opacity-0",
          "[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:[transform:translateY(150%)]",
        )}
      >
        <ToastPrimitive.Content className="flex items-start gap-3 p-4 transition-opacity duration-200 data-behind:opacity-0 data-expanded:opacity-100">
          {Icon && (
            <Icon
              weight="fill"
              className={cn(
                "mt-0.5 size-5 shrink-0",
                variant && toastIconClasses[variant],
              )}
            />
          )}
          <div className="min-w-0 flex-1">
            <ToastPrimitive.Title className="text-sm font-medium" />
            <ToastPrimitive.Description className="text-muted-foreground text-sm" />
          </div>
          <ToastPrimitive.Close
            aria-label="Dismiss"
            className="text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-ring/50 shrink-0 rounded-full p-1 transition-colors outline-none focus-visible:ring-[3px]"
          >
            <XIcon className="size-4" />
          </ToastPrimitive.Close>
        </ToastPrimitive.Content>
      </ToastPrimitive.Root>
    );
  });
}

function Toaster() {
  return (
    <ToastPrimitive.Provider toastManager={toastManager} timeout={5000}>
      <ToastPrimitive.Portal>
        <ToastPrimitive.Viewport className="fixed right-4 bottom-4 left-auto z-[100] mx-auto flex w-[calc(100vw-2rem)] flex-col outline-none sm:right-6 sm:bottom-6 sm:w-96">
          <ToastList />
        </ToastPrimitive.Viewport>
      </ToastPrimitive.Portal>
    </ToastPrimitive.Provider>
  );
}

export { Toaster };
