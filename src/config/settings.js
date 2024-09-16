import moment from "moment";

export const SETTINGS = {
  puzzle_code: [
    {
      date: '2024-09-14',
      code: [4, 8, 14, 15]
    },
    {
      date: '2024-09-15',
      code: [8, 4, 10, 1]
    },
    {
      date: '2024-09-16',
      code: [3, 10, 1, 9]
    },
  ],
  youtube_code: [
    {
      title: 'Watch YouTube Video #1',
      code: '070624'
    }
  ]
};

export function getPuzzleCode() {
  const date = moment().format("YYYY-MM-DD");
  return SETTINGS.puzzle_code.find(item => item.date == date);
}