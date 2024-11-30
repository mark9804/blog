<template>
  <!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
  <svg
    :width="size"
    :height="size"
    fill="none"
    version="1.1"
    id="Capa_1"
    viewBox="0 0 390 390"
    xmlns="http://www.w3.org/2000/svg"
    :style="{
      transform: `rotate(${rotate}deg) translateY(-5%)`,
    }"
  >
    <g id="XMLID_880_">
      <rect
        :fill="parseColor(color)"
        :stroke-width="strokeWidth"
        id="XMLID_882_"
        x="360"
        y="90"
        width="30"
        height="210"
      />
      <path
        :fill="parseColor(color)"
        id="XMLID_883_"
        :stroke-width="strokeWidth"
        d="M300,144.157c-20.487-32.341-59.871-54.282-105-54.282c-45.129,0-84.513,21.941-105,54.282V90H60v210h30
		v-54.157c20.487,32.341,59.871,54.282,105,54.282c45.129,0,84.513-21.941,105-54.282V300h30V90h-30V144.157z M135,250.943V139.057
		c15.935-11.92,36.969-19.182,60-19.182c23.031,0,44.065,7.262,60,19.182v111.887c-15.935,11.92-36.969,19.182-60,19.182
		C171.969,270.125,150.935,262.863,135,250.943z"
      />
      <rect
        :fill="parseColor(color)"
        id="XMLID_886_"
        :stroke-width="strokeWidth"
        y="90"
        width="30"
        height="210"
      />
    </g>
  </svg>
</template>

<script setup lang="ts">
import type { IconProps } from "../types/IconProps";
import { parseColor } from "../_utils/styleUtils";

withDefaults(defineProps<IconProps>(), {
  size: "16",
  color: "#2f2826",
  strokeWidth: "1",
  fill: false,
  rotate: 0,
});
</script>
