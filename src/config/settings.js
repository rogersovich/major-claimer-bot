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
    {
      date: '2024-09-25',
      code: [3, 4, 7, 6]
    },
    {
      date: '2024-09-26',
      code: [13, 14, 11, 12]
    },
    {
      date: '2024-09-27',
      code: [10, 4, 5, 1]
    },
    {
      date: '2024-09-28',
      code: [3, 5, 1, 6]
    },
    {
      date: '2024-09-29',
      code: [4, 7, 9, 3]
    },
    {
      date: '2024-10-02',
      code: [14, 15, 3, 1]
    },
    {
      date: '2024-10-03',
      code: [15, 4, 9, 10]
    },
    {
      date: '2024-10-04',
      code: [3, 6, 9, 1]
    },
    {
      date: '2024-10-05',
      code: [13, 6, 12, 10]
    },
    {
      date: '2024-10-06',
      code: [1, 2, 3, 4]
    },
    {
      date: '2024-10-07',
      code: [12, 3, 14, 5]
    },
    {
      date: '2024-10-08',
      code: [13, 4, 8, 6]
    },
    {
      date: '2024-10-09',
      code: [14, 5, 6, 7]
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
    {
      title: 'Watch YouTube Shorts #6',
      code: '241086'
    },
  ]
};

export function getPuzzleCode() {
  const date = moment().format("YYYY-MM-DD");
  return SETTINGS.puzzle_code.find(item => item.date == date);
}