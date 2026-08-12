// <th className='px-6 py-3'>TASK</th>
// <th className='px-6 py-3'>STATUS</th>
// <th className='px-6 py-3'>DUE DATE</th>
// <th className='px-6 py-3'>PRIORITY</th>
// <th className='px-6 py-3'>PROGRESS</th>

// <tr className='text-sm border-t border-t-gray-700'>
//     <td className='px-6 py-5 font-medium text-white'>Update user dashboard</td>
//     <td className='px-6 py-5'>In Progress</td>
//     <td className='px-6 py-5'>High</td>
//     <td className='px-6 py-5'>2025-06-15</td>
//     <td className='px-6 py-5'><progress className='rounded' max={100} value={90} /></td>
// </tr>
// <tr className='text-sm border-t border-t-gray-700'>
//     <td className='px-6 py-5 font-medium text-white'>Update user dashboard</td>
//     <td className='px-6 py-5'>In Progress</td>
//     <td className='px-6 py-5'>High</td>
//     <td className='px-6 py-5'>2025-06-15</td>
//     <td className='px-6 py-5'>99%</td>
// </tr>
// <tr className='text-sm border-t border-t-gray-700'>
//     <td className='px-6 py-5 font-medium text-white'>Update user dashboard</td>
//     <td className='px-6 py-5'>In Progress</td>
//     <td className='px-6 py-5'>High</td>
//     <td className='px-6 py-5'>2025-06-15</td>
//     <td className='px-6 py-5'>99%</td>
// </tr>
// <tr className='text-sm border-t border-t-gray-700'>
//     <td className='px-6 py-5 font-medium text-white'>Update user dashboard</td>
//     <td className='px-6 py-5'>In Progress</td>
//     <td className='px-6 py-5'>High</td>
//     <td className='px-6 py-5'>2025-06-15</td>
//     <td className='px-6 py-5'>99%</td>
// </tr>

function Table(props) {

    return (
        <div className='rounded-lg bg2'>
            <h3 className='font-bold text-lg py-5 px-6'>{props.title}</h3>

            <table className='w-full text3'>

                <thead>
                <tr className='text-xs font-medium border-t border-t-gray-700 bg-gray-900/50 text-left'>
                    {props.headers.map((header, index) => (
                        <th key={index} className='px-6 py-3'>
                            {header}
                        </th>
                    ))}
                </tr>
                </thead>

                <tbody>
                {props.rows.map((row, rowIndex) => (
                    <tr key={rowIndex} className='text-sm border-t-gray-700'>
                        {row.map((cell, cellIndex) => (
                            <td key={cellIndex} className='px-6 py-5'>
                                {cell}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default Table