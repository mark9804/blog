import { onMounted, onUnmounted } from "vue";
import { toast } from "vue-sonner";

const SELECTOR = "[data-formula]";

export function useFormulaCopy() {
  async function copyFormula(formula: string, isBlock: boolean) {
    if (!navigator.clipboard?.writeText) return;

    const delimiter = isBlock ? "$$" : "$";
    const text = `${delimiter}${formula}${delimiter}`;

    try {
      await navigator.clipboard.writeText(text);
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
    } catch {
      toast.error("复制公式失败", {
        position: "top-center",
      });
    }
  }

  function onClick(e: MouseEvent) {
    if (!(e.target instanceof Element)) return;

    const target = e.target.closest<HTMLElement>(SELECTOR);
    if (!target) return;

    const formula = target.dataset.formula?.trim();
    if (!formula) return;

    e.stopPropagation();

    // Block formulas already have display="true" from mathjax3
    const isBlock = target.getAttribute("display") === "true";
    void copyFormula(formula, isBlock);
  }

  onMounted(() => {
    document.addEventListener("click", onClick, true);
  });

  onUnmounted(() => {
    document.removeEventListener("click", onClick, true);
  });
}
