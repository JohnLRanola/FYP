import React, { Component } from "react";
import Modal from "./components/Modal";
import axios from "axios";
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewCompleted: false,
      prescriptionList: [],
      modal: false,
      activeItem: {
        name: "",
        doctor: "",
        date: "",
        notes: "",
        completed: false,
      },
    };
  }

  componentDidMount() {
    this.refreshList();
  }

  refreshList = () => {
    axios
      .get("/api/prescriptions/")
      .then((res) => this.setState({ prescriptionList: res.data }))
      .catch((err) => console.log(err));
  };

  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  handleSubmit = (item) => {
    this.toggle();

    if (item.id) {
      axios
        .put(`/api/prescriptions/${item.id}/`, item)
        .then((res) => this.refreshList());
      return;
    }
    axios
      .post("/api/prescriptions/", item)
      .then((res) => this.refreshList());
  };

  handleDelete = (item) => {
    axios
      .delete(`/api/prescriptions/${item.id}/`)
      .then((res) => this.refreshList());
  };

  createItem = () => {
    const item = { name: "", doctor: "", date: "", notes: "", completed: false };

    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  editItem = (item) => {
    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  displayCompleted = (status) => {
    if (status) {
      return this.setState({ viewCompleted: true });
    }

    return this.setState({ viewCompleted: false });
  };

  renderItems = () => {
    const { viewCompleted } = this.state;
    const newItems = this.state.prescriptionList.filter(
      item => item.completed === viewCompleted
    );
  
    return newItems.map(item => (
      <li
        key={item.id}
        className="list-group-item d-flex justify-content-between align-items-center"
      >
        <span
          className={`prescription-title mr-2 ${
            this.state.viewCompleted ? "completed-prescription" : ""
          }`}
          title={item.description}
        >
          <strong>Patient's Name:</strong> {item.name} <br/>
          <strong>Doctor's Name:</strong> {item.doctor} <br/>
          <strong>Prescription Date:</strong> {item.date} <br/>
          <strong>Additional Notes:</strong> {item.notes}
        </span>
        <span>
          <button
            onClick={() => this.editItem(item)}
            className="btn btn-secondary mr-2"
          >
            Edit
          </button>
          <button
            onClick={() => this.handleDelete(item)}
            className="btn btn-danger"
          >
            Delete
          </button>
        </span>
      </li>
    ));
  };

  render() {
    return (
      <main className="container">
        <h1 className="text-white text-uppercase text-center my-4">Prescription app</h1>
        <div className="row">
          <div className="col-md-6 col-sm-10 mx-auto p-0">
            <div className="card p-3">
              <div className="mb-4">
                <button
                  className="btn btn-primary"
                  onClick={this.createItem}
                >
                  Add Prescription
                </button>
              </div>
              <ul className="list-group list-group-flush border-top-0">
                {this.renderItems()}
              </ul>
            </div>
          </div>
        </div>
        {this.state.modal ? (
          <Modal
            activeItem={this.state.activeItem}
            toggle={this.toggle}
            onSave={this.handleSubmit}
          />
        ) : null}
      </main>
    );
  }
}

export default App;