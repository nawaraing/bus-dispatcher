// TODO: apiUrl과 routeId는 config 파일에서 가져오도록 수정
const apiUrl = 'http://kikibus.iptime.org:18080';
const routId = 70;

// 오늘 날짜를 'yyyy-MM-dd' 형태로 저장
const date = new Date();
const year = date.getFullYear();
const month = ('0' + (date.getMonth() + 1)).slice(-2); // 월은 0부터 시작하므로 +1 필요
const day = ('0' + date.getDate()).slice(-2);
const todayDate = `${year}-${month}-${day}`;

export const subBaseDate = '2024-05-20';

export const loginUrl = `${apiUrl}/auth/login`;
export const getTodayDispatchUrl = `${apiUrl}/dispatch/${routId}/${todayDate}`;
export const getTestDateDispatchUrl = `${apiUrl}/dispatch/${routId}/${subBaseDate}`;
export const getDispatchUrl = `${apiUrl}/dispatch/${routId}/`;
export const updateDispatchUrl = `${apiUrl}/dispatch/update/`;

export class DispatchItem {
  busId: number;
  busNumber: string;
  busRound: number;
  busType: string;
  driverId: number;
  driverName: string;
  id: string;
  routeName: string;
  startOrder: number;
  startTime: string;
  unixStartTime: number;

  constructor(busId: number,
                busNumber: string, 
                busRound: number, 
                busType: string, 
                driverId: number, 
                driverName: string, 
                id: string, 
                routeName: string,
                startOrder: number,
                startTime: string,
                unixStartTime: number) {
    this.busId = busId;
    this.busNumber = busNumber;
    this.busRound = busRound;
    this.busType = busType;
    this.driverId = driverId;
    this.driverName = driverName;
    this.id = id;
    this.routeName = routeName;
    this.startOrder = startOrder;
    this.startTime = startTime;
    this.unixStartTime = unixStartTime;
  }
}
  