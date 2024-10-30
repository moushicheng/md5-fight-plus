export function getRandomScope(start: number, end: number): number {
  // 确保 start 小于 end
  if (start >= end) {
    throw new Error("start 必须小于 end");
  }

  // 生成随机整数
  const random = Math.floor(Math.random() * (end - start + 1)) + start;
  return random;
}
