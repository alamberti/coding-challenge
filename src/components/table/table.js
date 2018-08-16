import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './table.css';

const Table = ({
    columns,
    data,
    renderFooter,
}) => (
    <div className='table__wrapper'>
    {!data.length ? 'No data available' :
        <table>
            <thead>
                <tr>
                    {columns.map(({ label }) => (
                        <th key={label}>{label}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((datum, i) =>
                    <tr key={datum.id || i}>
                        {columns.map(({ renderVal }, i) => (
                            <td key={i}>{renderVal(datum)}</td>
                        ))}
                    </tr>
                )}
            </tbody>
        </table>
    }
    <footer>
        {renderFooter && renderFooter()}
    </footer>
    </div>
);

Table.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.object),
    data: PropTypes.array,
    renderFooter: PropTypes.func,
};

export default Table;