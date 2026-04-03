import { onMounted, onUnmounted } from "vue";
import { useClipboard } from "@vueuse/core";

const SELECTOR = "[data-formula]";

export function useFormulaCopy() {
  const { copy } = useClipboard();

  function onClick(e: MouseEvent) {
    const target = (e.target as HTMLElement).closest(SELECTOR) as HTMLElement;
    if (!target) return;

    const formula = target.dataset.formula?.trim();
    if (!formula) return;

    // Block formulas already have display="true" from mathjax3
    const isBlock = target.getAttribute("display") === "true";
    const text = isBlock ? `$$${formula}$$` : `$${formula}$`;

    copy(text).then(() => {
      console.log("Copied", text);

      // TODO: use message component
      // window?.alert?.(`Copied: ${text}`);
    });

    e.stopPropagation();
  }

  onMounted(() => {
    document.addEventListener("click", onClick, true);
  });

  onUnmounted(() => {
    document.removeEventListener("click", onClick, true);
  });
}
