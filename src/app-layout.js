import React, { Component, Fragment } from 'react';
import classnames from 'classnames';
import './app-layout.css';
import { getPatients, paginatePatients } from './api-utils/patient-api';
import { InputCombo, Table } from './components';

class AppLayout extends Component {
    state = {
        isLoading: false,
        patients: [],
        pagination: {
            next: null,
            previous: null,
        },
        searchBy: 'name',
        searchTerm: '',
    };

    updatePatientData = ({ patients, next, previous }) => {
        this.setState({
            isLoading: false,
            patients,
            pagination: {
                next,
                previous,
            },
        });
    };

    handleRadioChanged = e => {
        this.setState({
            searchBy: e.target.value,
        });
    };

    handleSearchTermInputChange = e => {
        this.setState({
            searchTerm: e.target.value,
        });
    };

    handlePatientSearch = e => {
        const { searchBy, searchTerm } = this.state;

        getPatients(searchBy, searchTerm)
            .then(this.updatePatientData);
        this.setState({
            isLoading: true,
        });
    };

    handlePagination(direction) {
        if (direction > 0) {
            paginatePatients(this.state.pagination.next)
                .then(this.updatePatientData);
        } else if (direction < 0) {
            paginatePatients(this.state.pagination.previous)
                .then(this.updatePatientData);
        }
        this.setState({
            isLoading: true,
        });
    }

    getPatientDataColumns() {
        return [
            { label: 'ID', renderVal: patient => patient.id },
            {
                label: 'Name',
                renderVal: patient => patient.name.find(name => name.use === 'official').text,
            },
            { label: 'Gender', renderVal: patient => patient.gender },
            { label: 'DOB', renderVal: patient => patient.birthDate },
        ];
    }

    render() {
        const {
            isLoading,
            searchTerm,
            patients,
            pagination,
            searchBy
        } = this.state;

        const appLayoutClasses = classnames('app-layout', {
            'app-layout--loading': isLoading,
        });

        return (
            <main className={appLayoutClasses}>
                <header className='app-layout__header'>
                    <h1>Look up a patient</h1>
                    <div className='app-layout__search-form'>
                        <input
                            type='radio'
                            id='searchByName'
                            name='searchBy'
                            value='name'
                            checked={searchBy === 'name'}
                            onChange={this.handleRadioChanged}
                        />
                        <label htmlFor='searchByName'>Name</label>

                        <input
                            type='radio'
                            id='searchById'
                            name='searchBy'
                            value='_id'
                            checked={searchBy === '_id'}
                            onChange={this.handleRadioChanged}
                        />
                        <label htmlFor='searchById'>ID</label>

                        <InputCombo
                            buttonHandler={this.handlePatientSearch}
                            buttonLabel='Search'
                            className='patient-search'
                            disabled={isLoading}
                            id='patient-search-form'
                            inputHandler={this.handleSearchTermInputChange}
                            inputValue={searchTerm}
                            label='Patient search term:'
                        />
                    </div>
                </header>

                <Table
                    columns={this.getPatientDataColumns()}
                    data={patients}
                    renderFooter={() =>
                        <Fragment>
                            {pagination.previous &&
                                <button
                                    className='paginate-previous'
                                    type='button'
                                    onClick={this.handlePagination.bind(this, -1)}
                                    disabled={isLoading}
                                >
                                    Previous
                                </button>
                            }

                            {pagination.next &&
                                <button
                                    className='paginate-next'
                                    type='button'
                                    onClick={this.handlePagination.bind(this, 1)}
                                    disabled={isLoading}
                                >
                                    Next
                                </button>
                            }
                        </Fragment>
                    }
                />
            </main>
        );
    }
}

export default AppLayout;
