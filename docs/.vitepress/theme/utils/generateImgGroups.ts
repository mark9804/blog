import { generateImgComponent } from "./generateImgComponent";
import { cluster } from "radash";
import type { Token } from "../types/Token";

/**
 * 生成拼接好的图片组字符串，解决直接用变量传入 non-string Object 时解析会出错的问题
 * @param {Token[]} imgListRaw 图片信息列表
 * @returns {string} 拼接好的图片组模板字符串
 */
export function generateImgGroups(imgListRaw: Token[]) {
  const imgGroups = cluster(imgListRaw, 3);
  let result = "<a-space direction='vertical'>\n";
  for (const group of imgGroups) {
    result += `<a-space>\n`;
    for (const img of group) {
      result += `${generateImgComponent(img)}\n`;
    }
    result += `</a-space>\n`;
  }
  result += `</a-space>\n`;
  return result;
}
