import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const InputCombo = ({
    buttonHandler,
    buttonLabel,
    className,
    disabled,
    id,
    inputHandler,
    inputPlaceholder,
    inputValue,
    label,
}) => (
    <div id={id} className={classnames('input-combo', className)}>
        {label &&
            <label htmlFor={`${id}-input`}>{label}</label>
        }
        <input
            id={`${id}-input`}
            className='input-combo__input'
            disabled={disabled}
            type='text'
            placeholder={inputPlaceholder}
            value={inputValue}
            onChange={inputHandler}
            onKeyUp={handleKeyUp.bind(null, buttonHandler)}
        />
        <button
            className='input-combo__button'
            disabled={disabled}
            type='button'
            onClick={buttonHandler}
        >
            {buttonLabel}
        </button>
    </div>
);

InputCombo.propTypes = {
    buttonLabel: PropTypes.string.isRequired,
    buttonHandler: PropTypes.func.isRequired,
    className: PropTypes.string,
    disabled: PropTypes.bool.isRequired,
    id: PropTypes.string.isRequired,
    inputHandler: PropTypes.func.isRequired,
    inputPlaceholder: PropTypes.string,
    inputValue: PropTypes.string.isRequired,
    label: PropTypes.string,
};

export default InputCombo;

function handleKeyUp(handler, e) {
    if (e.key === 'Enter') {
        handler();
    }
}
