import React, { Component } from "react";
import QRCode from 'react-qr-code';
import axios from "axios";

class Pharmacies extends Component {
  state = {
    prescriptionList: [],
    redeemedPrescriptions: [],
    idToRedeem: "",
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

  handleRedeem = async () => {
    const { idToRedeem } = this.state;
    try {
      const response = await axios.get(`/api/prescriptions/${idToRedeem}/`);
      this.setState(prevState => {
        let newRedeemedPrescriptions = [...prevState.redeemedPrescriptions, response.data];
        if (newRedeemedPrescriptions.length > 10) {
          newRedeemedPrescriptions = newRedeemedPrescriptions.slice(-10);
        }
        return {
          redeemedPrescriptions: newRedeemedPrescriptions,
          idToRedeem: "",
        };
      });
    } catch (error) {
      console.error("Error redeeming prescription", error);
    }
  };

  handleIdChange = (event) => {
    this.setState({ idToRedeem: event.target.value });
  };

  renderItems = () => {
    return this.state.redeemedPrescriptions.map((item) => (
      <li
        key={item.id}
        className="list-group-item d-flex justify-content-between align-items-center"
      >
        <span
          className={`prescription-title mr-2 ${
            item.completed ? "completed-prescription" : ""
          }`}
          title={item.notes}
        >
          <strong>ID:</strong> {item.id} <br/>
          <strong>Patient's Name:</strong> {item.name} <br/>
          <strong>Doctor's Name:</strong> {item.doctor} <br/>
          <strong>Prescription Date:</strong> {item.date} <br/>
          <strong>Additional Notes:</strong> {item.notes} <br/>
          <strong>Completed:</strong> {item.completed ? 'Yes' : 'No'}
        </span>
        <QRCode value={item.id} />
      </li>
    ));
  };

  render() {
    return (
      <div className="container">
        <h1 className="text-center my-4">Pharmacy</h1>
        <div className="row">
          <div className="col-md-6">
            <h2>Redeem Prescription</h2>
            <input
              type="text"
              className="form-control my-4"
              placeholder="Enter Prescription ID"
              value={this.state.idToRedeem}
              onChange={this.handleIdChange}
            />
            <button
              className="btn btn-primary"
              onClick={this.handleRedeem}
            >
              Redeem
            </button>
            <h2 className="my-4">Redeemed Prescriptions</h2>
            <ul className="list-group">
              {this.state.redeemedPrescriptions.map((item) => (
                <li
                  key={item.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <span
                    className={`prescription-title mr-2 ${
                      item.completed ? "completed-prescription" : ""
                    }`}
                    title={item.notes}
                  >
                  <strong>ID:</strong> {item.id} <br/>
                  <strong>Patient's Name:</strong> {item.name} <br/>
                  <strong>Doctor's Name:</strong> {item.doctor} <br/>
                  <strong>Prescription Date:</strong> {item.date} <br/>
                  <strong>Additional Notes:</strong> {item.notes} <br/>
                  <strong>Completed:</strong> {item.completed ? 'Yes' : 'No'}
                  </span>
                  <QRCode value={item.id} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default Pharmacies;