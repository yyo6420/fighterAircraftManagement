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
                    return <th>{row}</th>
                })}
            </tbody>
        </table>
    )
}

export default Table