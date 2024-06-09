// src/components/DraggableRow.tsx
import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';

export interface DraggableRowProps {
  id: number;
  index: number;
  ids: string[];
  busId: number;
  busNumber: string;
  driverId: number;
  driverName: string;
  startTimes: string[];
  moveRow: (dragIndex: number, hoverIndex: number) => void;
  openSidebar: (data: string, id: string) => void
  activeRows: boolean[];
  rowIndex: number;
  activeColumns: boolean[]; // 활성 상태 배열 추가
  handleColumnActive: (data: string, id: string, activeRows: boolean[], rowIndex: number, columnIndex: number) => void; // 열 클릭 핸들러 함수 추가

}

const DraggableRow: React.FC<DraggableRowProps> = ({ id, index, ids, busId, busNumber, driverId, driverName, startTimes, moveRow, activeRows, rowIndex, activeColumns, handleColumnActive }) => {
  const ref = React.useRef<HTMLTableRowElement>(null);

  const [, drop] = useDrop({
    accept: 'row',
    hover(item: { index: number }, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveRow(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'row',
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));
  console.log('rowIndex: ' + rowIndex);

  return (
    <tr ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <td>{index + 1}</td>
      <td>{busNumber}</td>
      <td>{driverName}</td>
      {startTimes.map((startTime: string, idx: number) => (
        <td key={idx} className={activeColumns[idx] && activeRows[rowIndex] ? 'table-success' : ''} onClick={() => handleColumnActive(driverName + '-' + rowIndex + '-' + (idx+1).toString() + '-' + startTime, ids[idx], activeRows, rowIndex, idx)}><a id={ids[idx]}>{startTime}</a></td>
      ))}
    </tr>
  );
};

export default DraggableRow;
