import { defineLoader } from "vitepress";
import { userProfile } from "../../configs/userProfile";
import type { ScholarData } from "../types/Publication";
import { EMPTY_SCHOLAR_DATA, fetchScholarData } from "../utils/scholarUtils";

declare const data: ScholarData;
export { data };

export default defineLoader({
  async load(): Promise<ScholarData> {
    return (await fetchScholarData(userProfile.scholar)) ?? EMPTY_SCHOLAR_DATA;
  },
});
