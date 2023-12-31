import React, { Component } from "react";
import { Tab, Tabs } from 'react-bootstrap';
import QRCode from 'react-qr-code';
import axios from "axios";

class Pharmacies extends Component {
  state = {
    prescriptionList: [],
    redeemedPrescriptions: [],
    idToRedeem: "",
    requestedPrescriptions: [],
  };

  handleCompleteStatusChange = async (id) => {
    try {
      const response = await axios.put(`/api/prescriptions/${id}/`, { completed: true });
      this.setState(prevState => {
        const updatedPrescriptions = prevState.redeemedPrescriptions.map(prescription => {
          if (prescription.id === id) {
            return response.data;
          } else {
            return prescription;
          }
        });
        return { redeemedPrescriptions: updatedPrescriptions };
      });
    } catch (error) {
      console.error("Error updating prescription status", error);
    }
  };
  
  fetchRequestedPrescriptions = async () => {
    try {
      const response = await axios.get("/api/prescriptions/requested");
      this.setState({ requestedPrescriptions: response.data });
    } catch (error) {
      console.error("Error fetching requested prescriptions", error);
    }
  };

  componentDidMount() {
    this.fetchPrescriptions();
    this.fetchRequestedPrescriptions(); 
  }

  fetchPrescriptions = async () => {
    try {
      const response = await axios.get("/api/prescriptions/requested");
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

  renderRequestedItems = () => {
    return this.state.requestedPrescriptions.slice().reverse().map((item) => (
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

  renderItems = () => {
    return this.state.redeemedPrescriptions.slice().reverse().map((item) => (
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
      <div className="container py-5">
        <h1 className="text-center mb-5">Pharmacy</h1>
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card">
              <div className="card-body">
                <h2 className="card-title text-center">Redeem Prescription</h2>
                <input
                  type="text"
                  className="form-control my-4"
                  placeholder="Enter Prescription ID"
                  value={this.state.idToRedeem}
                  onChange={this.handleIdChange}
                />
                <div className="d-grid gap-2">
                  <button
                    className="btn btn-primary"
                    onClick={this.handleRedeem}
                  >
                    Redeem
                  </button>
                </div>
                <h2 className="card-title text-center mt-4">Redeemed Prescriptions</h2>
                <ul className="list-group">
                  {this.renderItems()}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


export default Pharmacies;