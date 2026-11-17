import { onMounted, onUnmounted } from "vue";
import { useClipboard } from "@vueuse/core";
import { toast } from "vue-sonner";

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
      const delimiter = isBlock ? "$$" : "$";
      const preview =
        formula.length > 24
          ? `${delimiter}${formula.slice(0, 24)}...${delimiter}`
          : text;
      toast.success("已复制公式", {
        description: preview,
        position: "top-center",
        classes: {
          content: "ely-toast__inline-content",
          description: "ely-toast__code-chip",
        },
      });
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
