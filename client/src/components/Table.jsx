import React, { useState } from 'react';
import { updateLandingTime } from "../utills/flightsFunctions";

function Table({ columns, rows, refreshData }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFlightId, setSelectedFlightId] = useState(null);
    const [landingTime, setLandingTime] = useState('');

    const handleOpenModal = (id) => {
        setSelectedFlightId(id);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setLandingTime('');
    };

    const handleUpdate = async () => {
        try {
            await updateLandingTime(selectedFlightId, landingTime);
            handleCloseModal();
            if (refreshData) refreshData();
        } catch (error) {
            alert("העדכון נכשל");
        }
    };

    const formatDateTime = (value) => {
        const date = new Date(value);

        if (isNaN(date.getTime()) || typeof value === 'number' || value.length < 10) {
            return value;
        }

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    };

    return (
        <div className="tableDiv">
            <table>
                <thead>
                    <tr>
                        {columns.map((column, index) => (
                            <th key={index}>{column}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, rowIndex) => {
                        const cells = Object.values(row);
                        return (
                            <tr key={row._id || rowIndex}>
                                {cells.map((cell, cellIndex) => (
                                    <td key={cellIndex}>
                                        {cell ? (
                                            formatDateTime(cell)
                                        ) : (
                                            <button
                                                className="tableButton"
                                                onClick={() => handleOpenModal(row._id)}
                                            >
                                                עידכון
                                            </button>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            {isModalOpen && (
                <div className="modalOverlay">
                    <div className="modalContent">
                        <h3>עדכון שעת נחיתה</h3>
                        <input
                            type="datetime-local"
                            className="modalInput"
                            value={landingTime}
                            onChange={(e) => setLandingTime(e.target.value)}
                        />
                        <div className="modalActions">
                            <button className="confirmBtn" onClick={handleUpdate}>עדכן שעה</button>
                            <button className="cancelBtn" onClick={handleCloseModal}>ביטול</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Table;