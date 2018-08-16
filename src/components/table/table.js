import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './table.css';

const Table = ({
    id,
    className,
    columns,
    data,
    renderFooter,
    rowHandler
}) => (
    <div id={id} className={classnames('table__wrapper', className)}>
    {!!data.length &&
        <table className='table'>
            <thead>
                <tr className='table__header'>
                    {columns.map(({ label }) => (
                        <th className='table__column-head' key={label}>{label}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((datum, i) =>
                    <tr
                        className='table__row'
                        key={datum.id || i}
                        onClick={handleRowClick.bind(null, rowHandler, datum)}
                    >
                        {columns.map(({ renderVal }, i) => (
                            <td className='table__cell' key={i}>{renderVal(datum)}</td>
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
    className: PropTypes.string,
    columns: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        renderVal: PropTypes.func.isRequired,
    })),
    data: PropTypes.array,
    id: PropTypes.string,
    renderFooter: PropTypes.func,
};

export default Table;

function handleRowClick(handler, datum, e) {
    e.stopPropagation();
    if (handler) {
        handler(datum);
    }
}