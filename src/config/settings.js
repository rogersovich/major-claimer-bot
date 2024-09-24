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
    {
      date: '2024-09-17',
      code: [10, 4, 1, 16]
    },
    {
      date: '2024-09-18',
      code: [8, 3, 7, 4]
    },
    {
      date: '2024-09-19',
      code: [9, 4, 20, 3]
    },
    {
      date: '2024-09-20',
      code: [3, 5, 1, 2]
    },
    {
      date: '2024-09-21',
      code: [13, 2, 11, 10]
    },
    {
      date: '2024-09-22',
      code: [6, 7, 5, 4]
    },
    {
      date: '2024-09-23',
      code: [4, 3, 2, 1]
    },
    {
      date: '2024-09-24',
      code: [5, 7, 8, 9]
    },
  ],
  youtube_code: [
    {
      title: 'Watch YouTube Video #1',
      code: '070624'
    },
    {
      title: 'Watch YouTube Shorts #4',
      code: '159390'
    },
  ]
};

export function getPuzzleCode() {
  const date = moment().format("YYYY-MM-DD");
  return SETTINGS.puzzle_code.find(item => item.date == date);
}