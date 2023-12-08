import React, { Component } from "react";
import axios from "axios";
import QRCode from 'react-qr-code';

class Patients extends Component {
    constructor(props) {
        super(props);
        this.state = {
          prescriptionList: [],
          redeemedPrescriptions: [],
          idToRedeem: "",
          prescriptionToView: null,
          showQRCode: false,
        };
    
        this.fetchPrescriptions = this.fetchPrescriptions.bind(this);
        this.handleViewPrescription = this.handleViewPrescription.bind(this);
        this.handleIdChange = this.handleIdChange.bind(this);
        this.handleToggleQRCode = this.handleToggleQRCode.bind(this);
        this.renderPrescription = this.renderPrescription.bind(this);
        this.sendToRequestedPrescriptions = this.sendToRequestedPrescriptions.bind(this);
      }

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

  sendToRequestedPrescriptions = async (prescription) => {
    try {
      const response = await axios.post('/api/prescriptions/requested', prescription);
      this.setState(prevState => ({
        requestedPrescriptions: [...prevState.requestedPrescriptions, response.data]
      }));
    } catch (error) {
      console.error("Error posting requested prescription", error);
    }
  };

  renderQRCode = () => {
    const { prescriptionToView, showQRCode } = this.state;
    if (!showQRCode || !prescriptionToView) return null;
    return <QRCode value={prescriptionToView.id.toString()} />;
  };

  render() {
    return (
      <div className="container py-5">
        <h1 className="text-center mb-5">Patient</h1>
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card">
              <div className="card-body">
                <h2 className="card-title">View Prescription</h2>
                <input
                  type="text"
                  className="form-control my-4"
                  placeholder="Enter Prescription ID"
                  value={this.state.idToRedeem}
                  onChange={this.handleIdChange}
                />
                <button
                  className="btn btn-primary btn-block my-2"
                  onClick={this.handleViewPrescription}
                >
                  View
                </button>
                <button
                  className="btn btn-secondary btn-block my-2"
                  onClick={this.handleToggleQRCode}
                >
                  Toggle QR Code
                </button>
                <h2 className="card-title mt-4">Prescription Details</h2>
                {this.renderPrescription()}
                {this.renderQRCode()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Patients;