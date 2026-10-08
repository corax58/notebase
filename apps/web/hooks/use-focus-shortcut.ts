import * as React from "react";

// Anywhere a keypress already means something: typing, or a dialog or menu
// layered over the page
const BUSY_TARGETS =
  "input, textarea, select, [contenteditable], [role='dialog'], [role='alertdialog'], [role='menu'], [role='listbox']";

/** Focuses the input when `/` is pressed anywhere on the page. */
export function useFocusShortcut(
  ref: React.RefObject<HTMLInputElement | null>,
  enabled = true,
) {
  React.useEffect(() => {
    if (!enabled) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "/") return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (!ref.current) return;
      if (
        event.target instanceof Element &&
        event.target.closest(BUSY_TARGETS)
      ) {
        return;
      }

      event.preventDefault();
      ref.current.focus();
      ref.current.select();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [ref, enabled]);
}
