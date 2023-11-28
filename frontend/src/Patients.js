import React, { Component } from "react";
import axios from "axios";
import QRCode from 'react-qr-code';

class Patients extends Component {
  state = {
    prescriptionList: [],
    redeemedPrescriptions: [],
    idToRedeem: "",
    prescriptionToView: null,
    showQRCode: false,
  };

  componentDidMount() {
    this.fetchPrescriptions();
  }

  fetchPrescriptions = async () => {
    try {
      const response = await axios.get("/api/prescriptions/");
      this.setState({ prescriptionList: response.data });
    } catch (error) {
      console.error("Error fetching prescriptions", error);
    }
  };

  handleViewPrescription = async () => {
    const { idToRedeem } = this.state;
    try {
      const response = await axios.get(`/api/prescriptions/${idToRedeem}/`);
      this.setState({ prescriptionToView: response.data });
    } catch (error) {
      console.error("Error viewing prescription", error);
    }
  };

  handleIdChange = (event) => {
    this.setState({ idToRedeem: event.target.value });
  };

  handleToggleQRCode = () => {
    this.setState(prevState => ({ showQRCode: !prevState.showQRCode }));
  };

  renderPrescription = () => {
    const { prescriptionToView } = this.state;
    if (!prescriptionToView) return null;
    return (
      <div>
        <strong>ID:</strong> {prescriptionToView.id} <br/>
        <strong>Patient's Name:</strong> {prescriptionToView.name} <br/>
        <strong>Doctor's Name:</strong> {prescriptionToView.doctor} <br/>
        <strong>Prescription Date:</strong> {prescriptionToView.date} <br/>
        <strong>Additional Notes:</strong> {prescriptionToView.notes} <br/>
        <strong>Completed:</strong> {prescriptionToView.completed ? 'Yes' : 'No'}
      </div>
    );
  };

  renderQRCode = () => {
    const { prescriptionToView, showQRCode } = this.state;
    if (!showQRCode || !prescriptionToView) return null;
    return <QRCode value={prescriptionToView.id.toString()} />;
  };

  render() {
    return (
      <div className="container">
        <h1 className="text-center my-4">Pharmacy</h1>
        <div className="row">
          <div className="col-md-6">
            <h2>View Prescription</h2>
            <input
              type="text"
              className="form-control my-4"
              placeholder="Enter Prescription ID"
              value={this.state.idToRedeem}
              onChange={this.handleIdChange}
            />
            <button
              className="btn btn-primary"
              onClick={this.handleViewPrescription}
            >
              View
            </button>
            <button
              className="btn btn-primary"
              onClick={this.handleToggleQRCode}
            >
              Toggle QR Code
            </button>
            <h2 className="my-4">Prescription Details</h2>
            {this.renderPrescription()}
            {this.renderQRCode()}
          </div>
        </div>
      </div>
    );
  }
}

export default Patients;