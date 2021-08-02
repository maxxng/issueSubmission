import React, { useReducer, useState } from "react";
import {
  Form,
  Button,
  Row,
  Col,
  FloatingLabel,
  Container,
} from "react-bootstrap";
import axios from "axios";

const initialState = {
  firstName: "",
  lastName: "",
  contactDetails: "",
  operatingSystem: "android",
  issue: "",
  stepsToReproduce: "",
  expected: "",
  actual: "",
};

const STEPS_TO_REPRODUCE_PLACEHOLEDER =
  "e.g\n1. Navigaate to signup \n2. Click on google signup \netc...";
const EXPECTED_PLACEHOLEDER =
  "e.g\n- Able to Signup with my google email \n- Redirect to google sign in";
const ACTUAL_PLACEHOLEDER =
  "e.g\n- Redirects to facebook login instead \n- Not intuitive";

const formReducer = (state, action) => {
  switch (action.type) {
    case "updateFirstName":
      return {
        ...state,
        firstName: action.payload,
      };
    case "updateLastName":
      return {
        ...state,
        lastName: action.payload,
      };
    case "updateEmail":
      return {
        ...state,
        contactDetails: action.payload,
      };
    case "updateOS":
      return {
        ...state,
        operatingSystem: action.payload,
      };
    case "updateIssue":
      return {
        ...state,
        issue: action.payload,
      };
    case "updateSteps":
      return {
        ...state,
        stepsToReproduce: action.payload,
      };
    case "updateExpected":
      return {
        ...state,
        expected: action.payload,
      };
    case "updateActual":
      return {
        ...state,
        actual: action.payload,
      };
    case "rest":
      return {
        ...state,
        issue: " ",
        stepsToReproduce: " ",
        expected: " ",
        actual: " ",
      };
    default:
      return state;
  }
};

const BugReportingPage = () => {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const [isMissing, setIsMissing] = useState(false);
  const [feedback, setFeedback] = useState("");

  const isValidForm = () => {
    if (
      state.firstName === "" ||
      state.lastName === "" ||
      state.contactDetails === "" ||
      state.operatingSystem === "" ||
      state.issue === "" ||
      state.stepsToReproduce === "" ||
      state.expect === "" ||
      state.actual === ""
    ) {
      return false;
    }
    return true;
  };

  return (
    <Container fluid="lg">
      <h2>Sponsee internal testing issue submission</h2>
      <Form>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="firstName">
            <Form.Label>First name</Form.Label>
            <Form.Control
              placeholder="John"
              value={state.firstName}
              onChange={(event) => {
                dispatch({
                  type: "updateFirstName",
                  payload: event.target.value,
                });
              }}
            />
          </Form.Group>
          <Form.Group as={Col} controlId="lastName">
            <Form.Label>Last name</Form.Label>
            <Form.Control
              placeholder="Tan"
              value={state.lastName}
              onChange={(event) => {
                dispatch({
                  type: "updateLastName",
                  payload: event.target.value,
                });
              }}
            />
          </Form.Group>
        </Row>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={state.contactDetails}
            onChange={(event) => {
              dispatch({
                type: "updateEmail",
                payload: event.target.value,
              });
            }}
          />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <FloatingLabel
          controlId="floatingSelect"
          label="Which OS are you testing on?"
        >
          <Form.Select
            className="mb-3"
            value={state.operatingSystem}
            onChange={(event) => {
              console.log(event.target.value);
              dispatch({
                type: "updateOS",
                payload: event.target.value,
              });
            }}
          >
            <option value="ios">iOS</option>
            <option value="android">Android</option>
          </Form.Select>
        </FloatingLabel>

        <Form.Group className="mb-3" controlId="issue">
          <Form.Label>Issue</Form.Label>
          <Form.Control
            as="textarea"
            placeholder="e.g Google login not working"
            value={state.issue}
            onChange={(event) => {
              dispatch({
                type: "updateIssue",
                payload: event.target.value,
              });
            }}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="steps">
          <Form.Label>Steps to reproduce</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            placeholder={STEPS_TO_REPRODUCE_PLACEHOLEDER}
            value={state.stepsToReproduce}
            onChange={(event) => {
              dispatch({
                type: "updateSteps",
                payload: event.target.value,
              });
            }}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="expected">
          <Form.Label>Expected behaviour/outcome</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            placeholder={EXPECTED_PLACEHOLEDER}
            value={state.expected}
            onChange={(event) => {
              dispatch({
                type: "updateExpected",
                payload: event.target.value,
              });
            }}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="actual">
          <Form.Label>Actual behaviour/outcome</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            placeholder={ACTUAL_PLACEHOLEDER}
            value={state.actual}
            onChange={(event) => {
              dispatch({
                type: "updateActual",
                payload: event.target.value,
              });
            }}
          />
        </Form.Group>
        {isMissing ? <p>Please fill in ALL fields!</p> : null}

        <Button
          className="mb-5"
          variant="primary"
          onClick={() => {
            if (isValidForm()) {
              axios
                .post(
                  "https://sponsee-public-backend.herokuapp.com/api/testFeedback/",
                  state
                )
                .then(function (response) {
                  console.log(response);
                  setFeedback(response.data);
                  const currIssues = localStorage.getItem("issuesSubmitted");
                  localStorage.setItem("issuesSubmitted", {
                    ...currIssues,
                    state,
                  });
                  setIsMissing(false);
                  dispatch({
                    type: "reset",
                  });
                })
                .catch(function (error) {
                  console.log(error);
                });
            } else {
              setIsMissing(true);
              setFeedback("");
              console.log("missing fields");
            }
          }}
        >
          Submit
        </Button>
      </Form>

      <div>{feedback}</div>

      {/* <IssueList /> */}
    </Container>
  );
};

export default BugReportingPage;
