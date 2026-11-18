import { defineLoader } from "vitepress";
import { userProfile } from "../../configs/userProfile.ts";
import type { ScholarData } from "../types/Publication.ts";
import { EMPTY_SCHOLAR_DATA, fetchScholarData } from "../utils/scholarUtils.ts";

declare const data: ScholarData;
export { data };

export default defineLoader({
  async load(): Promise<ScholarData> {
    return (await fetchScholarData(userProfile.scholar)) ?? EMPTY_SCHOLAR_DATA;
  },
});
