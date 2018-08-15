import React, { Component } from 'react';
import './app-layout.css';
import { getPatientsByName, paginatePatients } from './api-utils/patient-api';

class AppLayout extends Component {
    state = {
        patients: [],
        pagination: {
            next: null,
            previous: null,
        },
    };

    componentDidMount() {
        getPatientsByName('john')
            .then(this.updatePatientData);
    }

    updatePatientData = ({ patients, next, previous }) => {
        this.setState({
            patients,
            pagination: {
                next,
                previous,
            },
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
    }

    render() {
        const { patients, pagination } = this.state;

        return (
            <div className="app-layout">
                <ul className="app-layout-intro">
                    {patients.length ?
                        patients.map(({ id, name }) => {
                            return (
                                <li key={id} className='patient'>
                                    ID: {id}, Name: {name.find(n => n.use === 'official').text}
                                </li>
                            )
                        }): <li className='no-data'>No data available</li>
                    }
                </ul>

                {pagination.previous &&
                    <button className='paginate-previous' type='button' onClick={this.handlePagination.bind(this, -1)}>
                        Previous
                    </button>
                }
                {pagination.next &&
                    <button className='paginate-next' type='button' onClick={this.handlePagination.bind(this, 1)}>
                        Next
                    </button>
                }
            </div>
        );
    }
}

export default AppLayout;
