import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { updateLandingTime } from "../utills/flightsFunctions";

function Table({ columns, rows, refreshData, onDelete }) {
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

    const keys = columns.map((c) => c.key)

    return (
        <div className="tableDiv">
            <table>
                <thead>
                    <tr>
                        {columns.map((column, index) => (
                            <th key={index}>{column.header}</th>
                        ))}
                        <th key="delete">מחיקה</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, rowIndex) => {
                        return (
                            <tr key={row._id || rowIndex}>
                                {keys.map((key, cellIndex) => {
                                    const cellValue = row[key]
                                        return(
                                            <td key={cellIndex}>
                                                {cellValue ? (
                                                    formatDateTime(cellValue)
                                                ) : (
                                                    <button
                                                        className="tableButton"
                                                        onClick={() => handleOpenModal(row._id)}
                                                    >
                                                        עדכון שעת נחיתה
                                                    </button>
                                                )}
                                            </td>
                                        )
                                })}

                                {onDelete && (
                                    <td>
                                        <button
                                            className="deleteBtn"
                                            onClick={() => onDelete(row._id)}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                )}
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {isModalOpen && (
                <div className="modalOverlay">
                    <div className="modalContent tactical-theme">
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