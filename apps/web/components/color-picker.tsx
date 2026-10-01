"use client";

import { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Pipette } from "lucide-react";

export interface ColorPreset {
  name: string;
  value: string;
}

export interface ColorPickerProps {
  id?: string;
  /** Controlled hex value, e.g. "#3b82f6" */
  value?: string;
  /** Initial hex value when uncontrolled */
  defaultValue?: string;
  /** Called with the new hex value whenever it changes */
  onChange?: (hex: string) => void;
  /** Swatches shown in the "Presets" section */
  presets?: ColorPreset[];
  /** Label above the trigger button. Pass false to hide it. */
  label?: string | false;
  /** Disables the trigger button */
  disabled?: boolean;
  className?: string;
}

const DEFAULT_PRESETS: ColorPreset[] = [
  { name: "Slate", value: "#64748b" },
  { name: "Red", value: "#ef4444" },
  { name: "Orange", value: "#f97316" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Yellow", value: "#eab308" },
  { name: "Lime", value: "#84cc16" },
  { name: "Green", value: "#22c55e" },
  { name: "Emerald", value: "#10b981" },
  { name: "Teal", value: "#14b8a6" },
  { name: "Cyan", value: "#06b6d4" },
  { name: "Sky", value: "#0ea5e9" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Indigo", value: "#6366f1" },
  { name: "Violet", value: "#8b5cf6" },
  { name: "Purple", value: "#a855f7" },
  { name: "Fuchsia", value: "#d946ef" },
  { name: "Pink", value: "#ec4899" },
  { name: "Rose", value: "#f43f5e" },
];

function isValidHex(hex: string): boolean {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex);
}

function normalizeHex(hex: string): string {
  if (/^#([0-9A-Fa-f]{3})$/.test(hex)) {
    return (
      "#" +
      hex
        .slice(1)
        .split("")
        .map((c) => c + c)
        .join("")
    );
  }
  return hex;
}

function getContrastColor(hex: string): string {
  const h = normalizeHex(hex).replace("#", "");
  if (h.length !== 6) return "#000000";
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#000000" : "#ffffff";
}

/**
 * ColorPicker
 *
 * A shadcn/ui-based color picker with a preset swatch grid and a
 * custom color section (native color wheel + hex input).
 *
 * @example
 * const [color, setColor] = useState("#3b82f6");
 * <ColorPicker value={color} onChange={setColor} />
 */
export function ColorPicker({
  value,
  defaultValue = "#3b82f6",
  onChange,
  presets = DEFAULT_PRESETS,
  id = "",
  disabled = false,
  className,
}: ColorPickerProps) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string>(defaultValue);
  const current = isControlled ? (value as string) : internalValue;

  const [hexInput, setHexInput] = useState<string>(current);
  const [open, setOpen] = useState(false);
  const colorInputRef = useRef<HTMLInputElement>(null);

  function commitColor(next: string) {
    const normalized = normalizeHex(next);
    if (!isControlled) setInternalValue(normalized);
    setHexInput(normalized);
    onChange?.(normalized);
  }

  function handleHexChange(e: ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setHexInput(v);
    if (isValidHex(v)) commitColor(v);
  }

  function handleHexBlur() {
    if (!isValidHex(hexInput)) setHexInput(current);
  }

  return (
    <div
      className={className ? `w-full max-w-xs ${className}` : "w-full max-w-xs"}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger>
          <Button
            id={id}
            type="button"
            variant="outline"
            disabled={disabled}
            className="h-10 w-full justify-start gap-2 px-3 font-normal"
          >
            <span
              className="h-5 w-5 shrink-0 rounded-lg border border-slate-200"
              style={{ backgroundColor: current }}
            />
            <span className="text-sm tracking-wide text-slate-700 uppercase">
              {current}
            </span>
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-64 p-4" align="start">
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-xs font-medium tracking-wide text-slate-500 uppercase">
                Presets
              </p>
              <div className="grid grid-cols-6 gap-2">
                {presets.map((preset) => {
                  const selected =
                    preset.value.toLowerCase() === current.toLowerCase();
                  return (
                    <button
                      key={preset.value}
                      type="button"
                      title={preset.name}
                      onClick={() => commitColor(preset.value)}
                      className="relative flex h-7 w-7 items-center justify-center rounded-full border border-black/10 transition-transform hover:scale-110 focus:ring-2 focus:ring-slate-400 focus:ring-offset-1 focus:outline-none"
                      style={{ backgroundColor: preset.value }}
                    >
                      {selected && (
                        <Check
                          className="h-3.5 w-3.5"
                          style={{ color: getContrastColor(preset.value) }}
                          strokeWidth={3}
                        />
                      )}
                      <span className="sr-only">{preset.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default ColorPicker;
