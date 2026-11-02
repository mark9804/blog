import { defineLoader } from "vitepress";
import { userProfile } from "../../configs/userProfile";
import type { ScholarData } from "../types/Publication";
import {
  EMPTY_SCHOLAR_DATA,
  fetchScholarData,
  getScholarEndpoint,
} from "../utils/scholarUtils";

declare const data: ScholarData;
export { data };

export default defineLoader({
  async load(): Promise<ScholarData> {
    const endpoint = getScholarEndpoint(userProfile.meta);
    return (await fetchScholarData(endpoint)) ?? EMPTY_SCHOLAR_DATA;
  },
});
