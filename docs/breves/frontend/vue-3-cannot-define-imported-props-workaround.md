---
title: 绕过 Vue3 setup defineProps 无法 import 的问题
tags:
  - 前端
  - Vue
createdAt: "2022-11-24 16:15"
---

# 绕过 Vue3 setup defineProps 无法 import 的问题

> 当前版本已支持，直接正常 `import` 即可。

defineProps 不能识别外部 import 的问题[去年八月份就有人提出来了](https://github.com/vuejs/core/issues/4294)，过了一年快半 Vue 还是把它作为 rfcs 挂在那里，令人感叹。

具体表现如下。

![代码示例](https://cdn.sa.net/2024/11/26/JyqtFUcDQNzfOBV.webp)

![运行时报错](https://cdn.sa.net/2024/11/26/PsJTe2UqcrpMFAO.webp)

绕过的方案是不在 `defineProps<>` 中直接定义，而是套一层 `PropType`。

```vue
<script setup lang="ts">
import type { PropType } from "vue";
import { DesiredPropType } from "./DesiredPropType";

defineProps({
  content: {
    type: Object as PropType<DesiredPropType>,
  },
});
</script>
```

这样就可以正常运行了。

![正常运行](https://cdn.sa.net/2024/11/26/v6cnj57MR1aGXxb.webp)
