import React, { useCallback, useEffect, useState, useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import DraggableRow from './DraggableRow';
import SidebarModal from './SidebarModal';
import { DispatchItem, getDispatchUrl, subBaseDate } from './KikiiApi';

interface RowItem {
  busId: number;
  busNumber: string;
  driverId: number;
  driverName: string;
  startTimes: string[];
  ids: string[];
}

const DispatchTable: React.FC = () => {
  const token = localStorage.getItem("token");
  // console.log('token: ' + token);

  const [data, setData] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [sideDriverName, setSideDriverName] = useState<string>('이름 없음');
  const [sideCol, setSideCol] = useState<number>(0);
  const [sideRow, setSideRow] = useState<number>(0);
  const [sideStartTime, setSideStartTime] = useState<string>('00:00');
  const [sideId, setSideId] = useState<string>('00000');
  const [maxSizeStartTimesCnt, setMaxSizeStartTimesCnt] = useState<number>(0);

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

  // const [rows, setRows] = useState<RowItem[]>(data);
  const [rows, setRows] = useState<RowItem[]>([]);

  const moveRow = useCallback((dragIndex: number, hoverIndex: number) => {
    const draggedRow = rows[dragIndex];
    setRows(
      update(rows, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, draggedRow],
        ],
      }),
    );
  }, [rows]);


  const dateRef = useRef<HTMLTableCellElement>(null); // 특정 ID의 태그를 참조하는 ref 생성

  // let baseDate = new Date("2023-02-10");
  const [baseDate, setBaseDate] = useState<Date>(new Date(subBaseDate));

  const getWeekDayString = (date: Date): string => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return days[date.getDay()];
  };
  
  const parseDateStringFormat = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const parseDateHeaderFormat = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const weekDay = getWeekDayString(date);
    return `${year}년 ${month}월 ${day}일 (${weekDay})`;
  }

  const loadData = async (date: Date) => {
    try {
      // baseDate = date;

      if (dateRef.current) {
        // date 수정하기
        dateRef.current.textContent = parseDateHeaderFormat(date);
        console.log(dateRef.current.textContent);
      }

      const response = await fetch(getDispatchUrl + parseDateStringFormat(date), {
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
      responseData.object.forEach((item: DispatchItem) => {
        if (rowData != null && busId == item.busId && driverId == item.driverId) {
          rowData.startTimes.push(item.startTime);
          rowData.ids.push(item.id);
          startTimesCnt++;
        } else {
          if (rowData != null) {
            rowDatas.push(rowData);
            if (maxSizeStartTimesCnt < startTimesCnt) {
              setMaxSizeStartTimesCnt(startTimesCnt);
            }
            startTimesCnt = 0;
          }
          rowData = {
            busId: item.busId,
            busNumber: item.busNumber,
            driverId: item.driverId,
            driverName: item.driverName,
            startTimes: [],
            ids: []
          };
          rowData.startTimes.push(item.startTime);
          // console.log(item.id);
          rowData.ids.push(item.id);
          startTimesCnt++;

          busId = item.busId;
          driverId = item.driverId;
      }});
      if (rowData != null) {
        rowDatas.push(rowData);
      }
    
      setRows(rowDatas);
      console.log(rowDatas);
    } catch (error) {
      console.error('Error: ', error);
    }
  };

  useEffect(() => {
    loadData(baseDate);
  }, []);
  const ClickLeftArrow = async () => {
    const date = new Date(baseDate);
    date.setDate(date.getDate() - 1);  
    setBaseDate(date);
    await loadData(date);
    closeSidebar();
  };
  const ClickRightArrow = async () => {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + 1);  
    setBaseDate(date);
    await loadData(date);
    closeSidebar();
  };

  const openSidebar = (data: string, id: string) => {
    const splitData = data.split('-');
    const driverName = splitData[0];
    const row = splitData[1];
    const col = splitData[2];
    const startTime = splitData[3];

    setSideDriverName(driverName);
    setSideCol(parseInt(col, 10));
    setSideRow(parseInt(row, 10));
    setSideStartTime(startTime);
    setSideId(id);
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setActiveRows(new Array(rows.length).fill(false));
    setActiveColumns(new Array(maxSizeStartTimesCnt).fill(false));

    setIsSidebarOpen(false);
  };

  const [activeColumns, setActiveColumns] = useState<boolean[]>(new Array(maxSizeStartTimesCnt).fill(false));
  const [activeRows, setActiveRows] = useState<boolean[]>(new Array(rows.length).fill(false));

  useEffect(() => {
    setActiveRows(new Array(rows.length).fill(false));
  }, [rows]);
  
  const updateTime = (id: string, newTime: string) => {
    setRows(prevRows =>
      prevRows.map(row => ({
        ...row,
        startTimes: row.startTimes.map((time, index) =>
          row.ids[index] === id ? newTime : time
        )
      }))
    );
  };

  const handleColumnActive = (data: string, id: string, disactiveRows: boolean[], rowIndex: number, columnIndex: number) => {
    openSidebar(data, id);
    setActiveRows(prevActiveRows => {
      const updatedActiveRows = (new Array(rows.length).fill(false));

      setActiveColumns(prevActiveColumns => {
        const newActiveColumns = (new Array(maxSizeStartTimesCnt).fill(false));
        console.log(newActiveColumns);
        if (prevActiveRows[rowIndex] === false || prevActiveColumns[columnIndex] === false) {
          newActiveColumns[columnIndex] = true;
          updatedActiveRows[rowIndex] = true; // 해당 행의 값만 변경
        }
        return newActiveColumns;
      });
      return updatedActiveRows; // 새로운 배열로 상태 업데이트
    });
  };

  return (
    <>
      <div className={`content ${isSidebarOpen ? 'shrink' : ''}`}>
      <div className="row justify-content-center mb-4">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col">
                  <div className="demo-inline-spacing">
                    <nav aria-label="Page navigation">
                      <ul className="pagination justify-content-center" id="pagination">
                        <li className="page-item prev">
                          <a className="page-link" onClick={ClickLeftArrow}
                            ><i className="tf-icon bx bx-chevron-left"></i></a>
                        </li>
                        <li className="page-item ms-2 me-2" id="list-date" >
                          <h3 id="header-date" ref={dateRef} >-년 -월 -일 (-)</h3>
                        </li>
                        <li className="page-item next">
                          <a className="page-link" onClick={ClickRightArrow}
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
      

      <DndProvider backend={HTML5Backend}>
        <div className="mb-4">
          <div className="card">
            <h5 className="card-header" id="table-card-header">시간 및 차량, 성명란을 눌러 수정하세요</h5>
            <div className="table-responsive text-nowrap">
              <table className="table table-striped">
                <thead>
                  {theadAria}
                </thead>
                <tbody>
                  {rows ? (
                    rows.map((row: RowItem, index: number) => (
                    <DraggableRow
                      id={row.busId}
                      index={index}
                      ids={row.ids}
                      busId={row.busId}
                      busNumber={row.busNumber}
                      driverId={row.driverId}
                      driverName={row.driverName}
                      startTimes={row.startTimes}
                      moveRow={moveRow}
                      openSidebar={openSidebar}
                      activeRows={activeRows} // rowActive 상태를 전달
                      rowIndex={index} // rowActive 상태를 전달
                      activeColumns={activeColumns} // activeColumns 상태를 전달
                      handleColumnActive={handleColumnActive} // handleColumnActive 함수를 전달
                    />
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
      </DndProvider>
      </div>
      
      <SidebarModal isOpen={isSidebarOpen} onClose={closeSidebar} driverName={sideDriverName} row={sideRow} col={sideCol} startTime={sideStartTime} sideId={sideId} updateTime={updateTime} />
    </>
  );
};

export default DispatchTable;
