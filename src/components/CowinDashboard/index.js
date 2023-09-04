import {Component} from 'react'

import Loader from 'react-loader-spinner'

import VaccinationCoverage from '../VaccinationCoverage'

import VaccinationByGender from '../VaccinationByGender'

import VaccinationByAge from '../VaccinationByAge'

import './index.css'

const apiStatus = {
  success: 'SUCCESS',
  inprogress: 'INPROGRESS',
  failure: 'FAILURE',
}

class CowinDashboard extends Component {
  state = {
    last7DaysVaccination: [],
    vaccinationByGender: [],
    VaccinationByAge1: [],
    API: '',
  }

  componentDidMount() {
    this.getDetails()
  }

  getDetails = async () => {
    this.setState({API: apiStatus.inprogress})
    const api = 'https://apis.ccbp.in/covid-vaccination-data'
    const response = await fetch(api)
    const Data = await response.json()
    console.log(Data)
    if (response.ok === true) {
      const last = Data.last_7_days_vaccination
      const Last = last.map(each => ({
        vaccineDate: each.vaccine_date,
        dose1: each.dose_1,
        dose2: each.dose_2,
      }))
      const Middle = Data.vaccination_by_gender
      const last12 = Data.vaccination_by_age
      this.setState({
        last7DaysVaccination: Last,
        vaccinationByGender: Middle,
        VaccinationByAge1: last12,
        API: apiStatus.success,
      })
    } else {
      this.setState({API: apiStatus.failure})
    }
  }

  renderLoadingView = () => (
    <div data-testid="loader" className="center">
      <Loader type="ThreeDots" color="red" height={80} width={80} />
    </div>
  )

  renderFailureView = () => (
    <div className="Failure">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
        className="failure_View"
      />
      <h1 className="HEAD">Something went wrong</h1>
    </div>
  )

  renderView = () => {
    const {
      last7DaysVaccination,
      vaccinationByGender,
      VaccinationByAge1,
    } = this.state

    return (
      <>
        <ul>
          <VaccinationCoverage>{last7DaysVaccination}</VaccinationCoverage>
        </ul>
        <VaccinationByGender>{vaccinationByGender}</VaccinationByGender>
        <VaccinationByAge>{VaccinationByAge1}</VaccinationByAge>
      </>
    )
  }

  tharun = () => {
    const {API} = this.state
    switch (API) {
      case apiStatus.success:
        return this.renderView()
      case apiStatus.inprogress:
        return this.renderLoadingView()
      case apiStatus.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="container">
        <div className="firstContainer">
          <img
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png "
            alt="website logo"
            className="website_logo"
          />
          <h1 className="head">Co-WIN</h1>
        </div>
        <h1 className="cowin">CoWIN Vaccination in India</h1>
        {this.tharun()}
      </div>
    )
  }
}

export default CowinDashboard
