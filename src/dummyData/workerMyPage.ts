// 근무지 관리 더미 데이터
export const dummyWorkplaces = [
  {
    name: "맥도날드",
    joinedAt: "2025년 4월 23일",
    wage: "10,030원",
  },
  {
    name: "버거킹",
    joinedAt: "2025년 5월 15일",
    wage: "10,030원",
  },
];

// 보낸 근무요청 더미 데이터
export const dummyRequests = [
  {
    workplace: "교내근로",
    date: "1/24",
    time: "17:00 ~ 19:00",
    status: "거절",
    image: require("../assets/images/mypage/user.png"),
    detail: {
      workplaceName: "인하대 정석학술정보관",
      workDate: "1/24",
      startHour: "17",
      startMin: "00",
      endHour: "19",
      endMin: "00",
      breakMin: "0",
      wage: "10,300",
    },
  },
  {
    workplace: "교내근로",
    date: "1/24",
    time: "17:00 ~ 19:00",
    status: "대기",
    image: require("../assets/images/mypage/user.png"),
    detail: {
      workplaceName: "인하대 정석학술정보관",
      workDate: "1/24",
      startHour: "17",
      startMin: "00",
      endHour: "19",
      endMin: "00",
      breakMin: "0",
      wage: "10,300",
    },
  },
];
