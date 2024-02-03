/**
 * 수를 한글 단위를 사용한 문자열로 변환합니다. (예: 15,000,000을 1천 5백만으로 변환합니다.)
 * @param value 수
 * @returns 변환된 문자열
 */
export default function getPriceString(value: number, truncate = true) {
  const unit = ['', '만', '억', '조', '경', '해'];
  const unitCount = 10000;

  let result = '';
  let temp = Math.floor(value);
  let count = 0;

  while (temp > 0) {
    const current = temp % unitCount;
    temp = Math.floor(temp / unitCount);

    if (!(truncate && count === 0) && current > 0)
      result = `${current.toLocaleString()}${unit[count]} ${result}`;
    count++;
  }

  const trimmed = result.trim();
  if (trimmed === '') result = '0';
  return trimmed;
}
