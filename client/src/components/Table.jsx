function Table({ columns, rows }) {

    return (
        <div className="tableDiv">
            <table>
                <thead>
                    <tr>
                        {columns.map((column, index) => {
                            return <th key={index}>
                                {column}
                            </th>
                        })}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => {
                        const cells = Object.values(row);
                        return <tr key={index}>
                            {cells.map((cell, index) => {
                                return <td key={index}>
                                    {cell}
                                </td>
                            })}
                        </tr>
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default Table