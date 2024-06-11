import React, { useState, useEffect } from 'react';
import { updateDispatchUrl } from './KikiiApi';

interface SidebarModalProps {
  isOpen: boolean;
  onClose: () => void;
  driverName: string;
  row: number;
  col: number;
  startTime: string;
  sideId: string;
  updateTime: (sideId: string, newTime: string) => void;
}

const SidebarModal: React.FC<SidebarModalProps> = ({ isOpen, onClose, driverName, row, col, startTime, sideId, updateTime }) => {
  const token = localStorage.getItem("token");
  const start = startTime.split(':');
  const [hour, setHour] = useState(parseInt(start[0]));
  const [minute, setMinute] = useState(parseInt(start[1]));
  const [defaultHour, setDefaultHour] = useState(parseInt(start[0]));
  const [defaultMinute, setDefaultMinute] = useState(parseInt(start[1]));
  const [sideBarInfo, setSideBarInfo] = useState(`${driverName} - ${col}회차 / ${startTime}`);

  useEffect(() => {
    const start = startTime.split(':');
    setHour(parseInt(start[0]));
    setMinute(parseInt(start[1]));
    setDefaultHour(parseInt(start[0]));
    setDefaultMinute(parseInt(start[1]));
    setSideBarInfo(`${driverName} - ${col}회차 / ${startTime}`);
  }, [startTime]);

  const handleHourChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    let newHour = parseInt(e.target.value);
    if (newHour < 0) {
      newHour = 0;
    }
    if (newHour > 24) {
      newHour = 24;
    }
    setHour(newHour);
  };

  const handleMinuteChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    let newMinute = parseInt(e.target.value);
    if (newMinute < 0) {
      newMinute = 0;
    }
    if (newMinute > 59) {
      newMinute = 59;
    }
    setMinute(newMinute);
  };

  const submitChange = async () => {
    if (hour === defaultHour && minute === defaultMinute) {
      alert('수정할 시간을 입력해주세요.');
      return;
    }

    const response = await fetch(updateDispatchUrl + sideId + '/' + startTime, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    if (response.status === 200) {
      const responseData = await response.json();
      console.log(responseData);

      const element = document.getElementById(sideId);
      let newTime = "00:00";
      let hourStr: string = hour.toString();
      let minuteStr: string = minute.toString();
      if (element) {
        if (hourStr.length === 1) {
          hourStr = '0' + hourStr;
        }
        if (minuteStr.length === 1) {
          minuteStr = '0' + minuteStr;
        }
        newTime = hourStr + ":" + minuteStr;
        element.textContent = newTime;

        setDefaultHour(hour);
        setDefaultMinute(minute);

        setSideBarInfo(`${driverName} - ${col}회차 / ${newTime}`);
      }
      updateTime(sideId, newTime);
    
    }
  }

  return (
    <div className={`sidebar-modal ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-content">
        <h2 className="me-3">시간 수정</h2>

        <h5 className="">A. 변경할 시간</h5>
        <label htmlFor="html5-time-input" className="col-form-label">변경할 시간을 선택(클릭)해주세요.</label>
        <div className="mb-3">
          <input className="form-control" type="text" id="" value={sideBarInfo} disabled />
        </div>

        <h5 className="">B. 수정 시간 입력</h5>
        <label htmlFor="html5-time-input" className="col-form-label">수정할 시간을 입력해주세요.</label>
        <div className="mb-3 row">
          <div className="col-md-4">
          <input
              className="form-control"
              type="number"
              min="0"
              max="24"
              value={hour}
              onChange={handleHourChange}
            />
          </div>
          :
          <div className="col-md-4">
            <input
              className="form-control"
              type="number"
              min="0"
              max="59"
              value={minute}
              onChange={handleMinuteChange}
            />
          </div>
        </div>
        <button
          type="button"
          className="btn btn-secondary me-2"
          data-bs-dismiss="modal"
          onClick={onClose}
          >취소</button>
        <button
          type="submit"
          id="submit-button"
          className="btn btn-success me-2"
          onClick={submitChange}
          >변경</button>

        </div>
    </div>
  );
};

export default SidebarModal;
