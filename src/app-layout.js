import React, { Component, Fragment } from 'react';
import classnames from 'classnames';
import './app-layout.css';
import { getPatients, paginatePatients } from './api-utils/patient-api';
import { getConditions } from './api-utils/conditions-api';
import { InputCombo, Table } from './components';

class AppLayout extends Component {
    state = {
        hasError: false,
        isLoading: false,
        patients: [],
        pagination: {
            next: null,
            previous: null,
        },
        searchBy: 'name',
        searchTerm: '',
        selectedPatientConditions: [],
    };

    updatePatientData = ({ patients, next, previous }) => {
        this.setState({
            hasError: false,
            isLoading: false,
            patients,
            pagination: {
                next,
                previous,
            },
        });
    };

    updateConditionData = ({ conditions }) => {
        this.setState({
            isLoading: false,
            selectedPatientConditions: conditions,
        });
    }

    handleRadioChanged = e => {
        this.setState({
            searchBy: e.target.value,
            searchTerm: '',
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
            .then(this.updatePatientData)
            .catch(error => {
                this.setState({
                    hasError: true,
                    isLoading: false,
                });
            });
        this.setState({
            isLoading: true,
        });
    };

    handlePatientSelect = patient => {
        getConditions('patient', patient.id)
            .then(this.updateConditionData)
            .catch(error => {
                this.setState({
                    hasError: true,
                    isLoading: false,
                });
            });
        this.setState({
            isLoading: true,
        });
    };

    handlePagination(direction) {
        if (direction > 0) {
            paginatePatients(this.state.pagination.next)
                .then(this.updatePatientData)
                .catch(error => {
                    this.setState({
                        hasError: true,
                        isLoading: false,
                    });
                });
        } else if (direction < 0) {
            paginatePatients(this.state.pagination.previous)
                .then(this.updatePatientData)
                .catch(error => {
                    this.setState({
                        hasError: true,
                        isLoading: false,
                    });
                });
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

    getConditionDataColumns() {
        return [
            {
                label: 'Condition Name',
                renderVal: condition => {
                    const name = condition.code.text;
                    return <a target='_blank' href={`https://www.ncbi.nlm.nih.gov/pubmed/?term=${name}`}>{name}</a>;
                },
            },
            { label: 'Initial Date Recorded', renderVal: condition => condition.dateRecorded },
        ];
    }

    render() {
        const {
            hasError,
            isLoading,
            searchTerm,
            patients,
            pagination,
            searchBy,
            selectedPatientConditions,
        } = this.state;

        const appLayoutClasses = classnames('app-layout', {
            'app-layout--loading': isLoading,
        });

        return (
            <main className={appLayoutClasses}>
                <header className='app-layout__header'>
                    <h1>Search for patients</h1>
                    <div className='app-layout__search-form'>
                        <span className='search-by__label'>Search by:</span>
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

                {hasError &&
                    <Fragment>
                        <h2>The application has encountered an error</h2>
                        <p>Make sure your search term is for the correct query parameter.</p>
                    </Fragment>
                }

                {!!patients && !!patients.length && !hasError &&
                    <section className='app-layout__content'>
                        <Table
                            id='patients-table'
                            className='app-layout__patients-list'
                            columns={this.getPatientDataColumns()}
                            data={patients}
                            rowHandler={this.handlePatientSelect}
                            renderFooter={() =>
                                <Fragment>
                                    {(pagination.previous || pagination.next) &&
                                        <button
                                            className='paginate-previous'
                                            type='button'
                                            onClick={this.handlePagination.bind(this, -1)}
                                            disabled={isLoading || !pagination.previous}
                                        >
                                            Previous
                                        </button>
                                    }

                                    {(pagination.previous || pagination.next) &&
                                        <button
                                            className='paginate-next'
                                            type='button'
                                            onClick={this.handlePagination.bind(this, 1)}
                                            disabled={isLoading || !pagination.next}
                                        >
                                            Next
                                        </button>
                                    }
                                </Fragment>
                            }
                        />

                        {!!selectedPatientConditions && !!selectedPatientConditions.length &&
                            <Table
                                id='patient-conditions-table'
                                className='app-layout__conditions-list'
                                columns={this.getConditionDataColumns()}
                                data={selectedPatientConditions}
                            />
                        }
                    </section>
                }
                {isLoading && <div className='overlay'></div>}
                {isLoading && <div className='loader'>Loading...</div>}
            </main>
        );
    }
}

export default AppLayout;
