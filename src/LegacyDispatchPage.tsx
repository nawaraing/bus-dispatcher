import React, { useState, useEffect } from 'react';
import { DispatchItem, getTestDateDispatchUrl } from './KikiiApi';

const DispatchPage: React.FC = () => {
  const name = localStorage.getItem("name");
  const token = localStorage.getItem("token");

  const [data, setData] = useState<any>(null);
  const [tableWidth, setTableWidth] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  class RowItem {
    busId: number;
    busNumber: string;
    driverId: number;
    driverName: string;
    startTimes: string[];

    constructor(busId: number, busNumber: string, driverId: number, driverName: string, startTimes: string[]) {
      this.busId = busId;
      this.busNumber = busNumber;
      this.driverId = driverId;
      this.driverName = driverName;
      this.startTimes = [];
    }
  }
    

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(getTestDateDispatchUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const responseData = await response.json();
        const rowDatas: RowItem[] = [];
        let rowData: RowItem | null = null;
        let busId = -1;
        let driverId = -1;
        let startTimesCnt = 0;
        let maxSizeStartTimesCnt = 0;
        responseData.object.forEach((item: DispatchItem) => {
          if (rowData != null && busId == item.busId && driverId == item.driverId) {
            rowData.startTimes.push(item.startTime);
            startTimesCnt++;
          } else {
            if (rowData != null) {
              rowDatas.push(rowData);
              if (maxSizeStartTimesCnt < startTimesCnt) {
                maxSizeStartTimesCnt = startTimesCnt;
              }
              startTimesCnt = 0;
            }
            rowData = {
              busId: item.busId,
              busNumber: item.busNumber,
              driverId: item.driverId,
              driverName: item.driverName,
              startTimes: []
            };
            rowData.startTimes.push(item.startTime);
            startTimesCnt++;

            busId = item.busId;
            driverId = item.driverId;
          }
        });
        if (rowData != null) {
          rowDatas.push(rowData);
        }

        setData(rowDatas);
        setTableWidth(maxSizeStartTimesCnt);
        console.log(rowDatas);
        console.log(maxSizeStartTimesCnt);
      } catch (error) {
        setError("");
      }
    };

    fetchData(); // 컴포넌트가 마운트될 때 API 요청 보내기

    // useEffect의 cleanup 함수는 컴포넌트가 언마운트될 때 호출됩니다.
    // 이 예제에서는 cleanup 함수가 필요하지 않으므로 생략합니다.
  }, []); // useEffect의 두 번째 인자로 빈 배열을 전달하여 컴포넌트가 마운트될 때 한 번만 실행되도록 합니다.
  
  // thead
  const busRound = [];
  for (let i = 1; i <= 18; i++) {
    busRound.push(
      <th>{i}</th>
    );
  }
  const theadAria =
  <tr>
    <th>순번</th>
    <th>차량번호</th>
    <th>성명</th>
    {busRound}
  </tr>;


  return (
    <>
      <nav
        className="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme"
        id="layout-navbar"
        >
        <div className="navbar-nav-left d-flex align-items-center" id="navbar-collapse">
          <ul className="navbar-nav flex-row align-items-center ms-auto">
            <li className="nav-item lh-1 me-3">
              <a href="dashboard" className="fw-semibold d-block mb-1">홈</a>
            </li>
            <li className="nav-item lh-1 me-3">
              <a href="#" className="fw-semibold d-block mb-1">근무 관리</a>
            </li>
            <li className="nav-item lh-1 me-3">
              <a href="dispatch" className="fw-semibold d-block mb-1">배차 관리</a>
            </li>
            <li className="nav-item lh-1 me-3">
              <a href="#" className="fw-semibold d-block mb-1">자원 관리</a>
            </li>
          </ul>
        </div>
        <div className="navbar-nav-right d-flex align-items-center" id="navbar-collapse">
          <ul className="navbar-nav flex-row align-items-center ms-auto">
            <li className="nav-item lh-1 me-3">
              <img src="" />
            </li>
            <li className="nav-item lh-1 me-3">
              <div className="fw-bold">{name}</div>님
            </li>
            <li className="nav-item lh-1 me-3">
              <a href="logout" className="fw-semibold d-block mb-1">Logout</a>
            </li>
          </ul>
        </div>
      </nav>

      <div className="content-wrapper">
        <div className="container-xxl flex-grow-1 container-p-y">
          <div className="row justify-content-center mb-4">
            <div className="col-md-4">
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col">
                      <div className="demo-inline-spacing">
                        <nav aria-label="Page navigation">
                          <ul className="pagination justify-content-center" id="pagination">
                            <li className="page-item prev">
                              <a className="page-link" href="javascript:void(0);"
                                ><i className="tf-icon bx bx-chevron-left"></i></a>
                            </li>
                            <li className="page-item ms-2 me-2">
                              <h3>2024년 6월 7일 (금)</h3>
                            </li>
                            <li className="page-item next">
                              <a className="page-link" href="javascript:void(0);"
                                ><i className="tf-icon bx bx-chevron-right"></i></a>
                            </li>
                          </ul>
                        </nav>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Striped Table */}
          <div className="mb-4">
            <div className="card">
              <h5 className="card-header" id="table-card-header">시간 및 차량, 성명란을 눌러 수정하세요</h5>
              <div className="table-responsive text-nowrap">
                <table className="table table-striped">
                  <thead>
                    {theadAria}
                  </thead>
                  
                  {/* // 초기 데이터를 tbody에서 읽어다가 pagination 연산을 진행하기에 아래 <tbody>는 필수 */}
                  <tbody className="table-border-bottom-0" id="table-body">
                  {data ? (
                    data.map((item: RowItem, idx: number) => (
                      <tr key={item.busId}>
                        <td>{idx + 1}</td>
                        <td><i className="fab fa-angular fa-lg me-3"><strong id="">{item.busNumber}</strong></i></td>
                        <td>{item.driverName}</td>
                        {item.startTimes.map((startTime: String) => (
                          <td>{startTime}</td>
                        ))}
                      </tr>
                  ))) : (
                    <tr>
                      <td colSpan={4}>Loading...</td>
                    </tr>
                  )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* Striped Table */}
        </div>
      </div>
    </>
  );
};

export default DispatchPage;
