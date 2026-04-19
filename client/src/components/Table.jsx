function Table({ columns, rows }) {

    return (
        <table>
            <tbody>
                <tr>
                    {columns.map(column => {
                        return <th>{column}</th>
                    })}
                </tr>
                {rows.map(row => {
                    const cells = Object.values(row);
                    return <tr>
                        {cells.map(cell => {
                            return <th>{cell}</th>
                        })}
                    </tr>
                })}
            </tbody>
        </table>
    )
}

export default Table