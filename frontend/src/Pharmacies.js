import React, { Component } from "react";
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
          <strong>Additional Notes:</strong> {item.notes}
        </span>
      </li>
    ));
  };

  render() {
    return (
      <main className="container">
        <h1 className="text-white text-uppercase text-center my-4">Pharmacy app</h1>
        <div className="row">
          <div className="col-md-6 col-sm-10 mx-auto p-0">
            <div className="card p-3">
              <div className="mb-4">
                <input
                  type="text"
                  value={this.state.idToRedeem}
                  onChange={this.handleIdChange}
                  placeholder="Enter prescription ID to redeem"
                />
                <button onClick={this.handleRedeem}>Redeem</button>
              </div>
              <ul className="list-group list-group-flush border-top-0">
                {this.renderItems()}
              </ul>
            </div>
          </div>
        </div>
      </main>
    );
  }
}

export default Pharmacies;