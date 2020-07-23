import React, { useState } from "react";
import logo from "../../assets/logo.svg";
import {
  Stepper,
  StepConnector,
  StepLabel,
  Step,
  Grid,
  Card,
  CardContent,
  Divider,
  TextField,
  Button,
  Radio,
  RadioGroup,
  IconButton,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Modal,
} from "@material-ui/core";
import { Check, CancelOutlined, EditOutlined } from "@material-ui/icons";
import RegSetup from "../../data/registration-form-setup-information.json";

import { makeStyles, withStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import styled from "styled-components";
import moment from "moment";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import "./index.css";
const InformationWord = styled.div`
  font-family: Roboto;
  font-size: 20px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.4;
  letter-spacing: 0.2px;
  color: #1a1a1a;
`;
const Word = styled.div`
  font-family: Roboto;
  font-size: ${({fontSize}) => fontSize ? fontSize : '20px'};
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.4;
  letter-spacing: 0.2px;
  color: ${({color}) => color ? color : 'black'};
  @media (max-width: 680px) {
    font-size:14px
  }
`;
const InputField = styled.input`
  border-radius: 10px;
  border: 1px solid #979797;
  height: 40px;
  width: 100%;
  margin-top: 14px;
  text-indent: 20px;
  font-size: 16px;
  outline: none;
  ::placeholder {
    font-family: Roboto;
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.75;
    letter-spacing: 0.16px;
    color: #1a1a1a;
  }
`;
const NextStep = styled(Button)`
  width: 210px;
  height: 40px;
  font-family: Roboto;
  font-size: 20px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 2.4;
  letter-spacing: normal;
  margin-top: 30px;
  @media (max-width: 680px) {
    width: 100%;
    margin-bottom: 10px;
    margin-top: 10px;
  }
`;

const LayoutGrid = styled(Grid)`
  width:50%;
  @media (max-width: 800px) {
    width: 100%;
  }
`;
const NewParticipantGrid = styled(Grid)`
  
  @media (max-width: 680px) {
    flex-direction:column-reverse;
  }
`;
const LineConnector = withStyles({
  alternativeLabel: {
    top: 25,
  },
  active: {
    "& $line": {
      backgroundColor: "#eeeeee",
    },
  },
  completed: {
    "& $line": {
      backgroundColor: "#eeeeee",
    },
  },
  line: {
    height: 3,
    border: 0,
    backgroundColor: "#eeeeee",
    borderRadius: 1,
  },
})(StepConnector);
const circleStyle = makeStyles({
  root: {
    backgroundColor: "white",
    fontFamily: "Roboto",
    fontSize: "16px",
    zIndex: 1,
    color: "black",
    width: 50,
    height: 50,
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
    border: "solid 1px #1a1a1a",
    opacity: "0.2",
  },
  active: {
    opacity: 1,
  },
});
const StepIcons = (props) => {
  const classes = circleStyle();
  const { active, completed } = props;

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
      })}
    >
      {completed ? (
        <Check className={classes.completed} />
      ) : (
        <div className={classes.circle}>{props.icon}</div>
      )}
    </div>
  );
};
const steps = ["Types & Fees", "Workshops", "Summary"];
const emailRegexp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const Home = () => {
  const [step, setStep] = useState(0);
  const [edit, setEdit] = useState(false);
  const [openNewParticipantDialog, setOpenNewParticipantDialog] = useState(
    false
  );
  const [editIndex, setEditIndex] = useState(null);
  const [blurFields, setBlurFields] = useState({});
  const [fields, setFields] = useState({
    event_registration_type_id: null,
    workshops: [],
  });
  const [result, setResult] = useState([]);

  const handleChange = (field, e) => {
    let tempFields = { ...fields };
    tempFields[field] = e.target.value;
    setFields(tempFields);
  };
  const handleOnBLur = (field, e) => {
    let tempFields = { ...blurFields };
    tempFields[field] = true;
    setBlurFields(tempFields);
  };
  const handleChangeRegType = () => {
    let tempFields = { ...fields };
    tempFields.event_registration_type_id = null;
    tempFields.event_registration_type_price = null;

    setFields(tempFields);
  };
  const handleSelectRegType = (id, price) => {
    let tempFields = { ...fields };
    tempFields.event_registration_type_id = id;
    tempFields.event_registration_type_price = price;
    setFields(tempFields);
  };
  const handleAddWorkshop = (id, price) => {
    let tempFields = { ...fields };
    tempFields.workshops.push({
      event_workshop_id: id,
      event_workshop_price: price,
    });
    setFields(tempFields);
  };
  const countOfWorkshop = (id) => {
    let counter = 0;
    if (fields.workshops.length > 0) {
      counter = fields.workshops.reduce(
        (counter, { event_workshop_id }) =>
          event_workshop_id === id ? (counter += 1) : counter,
        0
      );
    }
    if (counter) {
      return `(x${counter})`;
    }
  };
  const calculateTotalPrice = (tempFields) => {
    let totalPrice = 0;
    totalPrice += tempFields.event_registration_type_price;
    let currency = RegSetup.event_currency === "USD" ? "$" : "";
    if (tempFields.workshops.length > 0) {
      totalPrice += tempFields.workshops.reduce(
        (price, { event_workshop_price }) => (price += event_workshop_price),
        0
      );
    }
    return currency + "" + totalPrice;
  };
  const calculateTotal = () => {
    let totalPrice = 0;
    let currency = RegSetup.event_currency === "USD" ? "$" : "";
    for (let participant of result) {
      totalPrice += participant.event_registration_type_price;
      for (let workshop of participant.workshops) {
        totalPrice += workshop.event_workshop_price;
      }
    }
    return currency + "" + totalPrice;
  };
  const nextDisabled = () => {
    if (step === 0) {
      return (
        !fields.event_registration_type_id ||
        !fields.event_registration_firstname ||
        !fields.event_registration_lastname ||
        !fields.event_registration_email ||
        (fields.event_registration_email&&  !fields.event_registration_email.match(emailRegexp))
      );
    }
    return false;
  };
  const deleteAdditionalService = (participant, workshop) => {
    let tempResult = [...result];
    tempResult[participant].workshops.splice(workshop, 1);
    setResult(tempResult);
  };
  const deleteParticipant = (participant) => {
    let tempResult = [...result];
    tempResult.splice(participant, 1);
    setResult(tempResult);
  };
  const editParticipant = (participant) => {
    let tempResult = [...result];
    setFields(tempResult[participant]);
    setEdit(true);
    setEditIndex(participant);
    setStep(0);
  };
  return (
    <Grid container direction="column" alignItems="center" justify="center">
      <Modal
        open={openNewParticipantDialog}
        onClose={() => {
          setOpenNewParticipantDialog(false);
        }}
      >
        <Card
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <CardContent>
            <Word fontSize="24px"> TERMS</Word>
            <Word color='grey'>
              {" "}
              -In this step, you can register as many persons as you can until
              you completeyour registration
            </Word>
            <Word  color='grey'>
              {" "}
              -After you complete this step, the persons you registered can
              access and manage their accounts by using login details that we
              will send by email
            </Word>
            <Word  color='grey'>
              {" "}
              -If this is a paid event, registration fees of each participant
              you registered will be added to your account
            </Word>
            <Word  color='grey'>
              {" "}
              -You can cancel this process and return to the summary page by
              clicking "CANCEL" button below
            </Word>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <NextStep
                variant="outlined"
                color="primary"
                onClick={() => {
                  setOpenNewParticipantDialog(false);
                }}
              >
                Cancel
              </NextStep>
              <NextStep
                variant="contained"
                color="primary"
                onClick={() => {
                  setStep(0);
                  setBlurFields({});

                  setFields({
                    event_registration_type_id: null,
                    workshops: [],
                  });
                  setOpenNewParticipantDialog(false);
                }}
              >
                Accept
              </NextStep>
            </div>
          </CardContent>
        </Card>
      </Modal>
      <LayoutGrid container item justify="center">
        <Card style={{background:'#1de9b6',width:'100%'}}>
          <CardContent>
            <Grid container xs={10}>
              <Word fontSize='24px' item xs={12} justify="left">
                {RegSetup.event_long_name}
              </Word>
              <Grid container xs={12} justify="left">
                <Word fontSize='16px'>{RegSetup.venue.event_venue_title}&nbsp; </Word>
                <Word fontSize='16px'>{RegSetup.venue.event_venue_city} &nbsp;</Word>
                <Word fontSize='16px'>{RegSetup.venue.event_venue_country}&nbsp; </Word>
                <Word fontSize='16px'>
                  {moment(RegSetup.event_start_date).format(
                    RegSetup.event_date_format
                  )} - {moment(RegSetup.event_end_date).format(
                    RegSetup.event_date_format
                  )}
                </Word>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </LayoutGrid>
      <LayoutGrid item container  justify="center">
        <Stepper
          activeStep={step}
          alternativeLabel
          connector={<LineConnector />}
          style={{ background: "transparent",width:'100%' }}
        >
          {steps.map((label, index) => {
            const stepProps = {};
            const labelProps = { index };
            return (
              <Step key={label} {...stepProps}>
                <StepLabel StepIconComponent={StepIcons} {...labelProps}>
                  {label}
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </LayoutGrid>
      <LayoutGrid item container justify="center" >
        {step === 0 && (
          <React.Fragment>
            <Grid
              item
              container
              xs={12}
              justify="center"
              direction="column"
              alignContent="center"
            >
              <Word>Registration Types and Fees</Word>
              {RegSetup.registration_types.map((type, index) => {
                if (
                  fields.event_registration_type_id === null ||
                  type.event_registration_type_id ===
                    Number(fields.event_registration_type_id)
                ) {
                  return (
                    <Card style={{ width: "100%", margin: "10px 0px" }}>
                      <CardContent>
                        <Grid
                          container
                          justify="space-between"
                          alignItems="center"
                        >
                          <FormControlLabel
                            value={type.event_registration_type_id}
                            control={<Radio />}
                            checked={
                              type.event_registration_type_id ===
                              Number(fields.event_registration_type_id)
                            }
                            label={type.event_registration_type_title}
                            onClick={() =>
                              handleSelectRegType(
                                type.event_registration_type_id,
                                type.event_registration_type_price
                              )
                            }
                          />
                          <div>
                            {RegSetup.event_currency === "USD" ? "$" : ""}
                            {type.event_registration_type_price}
                            {type.event_registration_type_id ===
                              Number(fields.event_registration_type_id) && (
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={handleChangeRegType}
                                style={{ margin: "0px 10px" }}
                              >
                                Change
                              </Button>
                            )}
                          </div>
                        </Grid>
                      </CardContent>
                    </Card>
                  );
                }
              })}
            </Grid>
            <Grid item
              container
              xs={12}
              justify="center"
              direction="column"
              alignContent="center">
            <Card style={{ width: "100%", margin: "10px 0px" }}>
              <CardContent>
                <form>
                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <TextField
                        required
                        fullWidth
                        label="Name"
                        variant="outlined"
                        margin="dense"
                        error={
                          blurFields.event_registration_firstname &&
                          !fields.event_registration_firstname
                        }
                        onBlur={handleOnBLur.bind(
                          this,
                          "event_registration_firstname"
                        )}
                        helperText={
                          blurFields.event_registration_firstname &&
                          !fields.event_registration_firstname
                            ? "Must not be Empty."
                            : ""
                        }
                        defaultValue={fields.event_registration_firstname}
                        onChange={handleChange.bind(
                          this,
                          "event_registration_firstname"
                        )}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        required
                        fullWidth
                        variant="outlined"
                        label="Surname"
                        margin="dense"
                        error={
                          blurFields.event_registration_lastname &&
                          !fields.event_registration_lastname
                        }
                        onBlur={handleOnBLur.bind(
                          this,
                          "event_registration_lastname"
                        )}
                        helperText={
                          blurFields.event_registration_lastname &&
                          !fields.event_registration_lastname
                            ? "Must not be Empty."
                            : ""
                        }
                        defaultValue={fields.event_registration_lastname}
                        onChange={handleChange.bind(
                          this,
                          "event_registration_lastname"
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        margin="dense"
                        type="email"
                        label="E-Mail"
                        error={
                          (blurFields.event_registration_email &&
                            !fields.event_registration_email) ||
                          (fields.event_registration_email &&
                            !fields.event_registration_email.match(emailRegexp))
                        }
                        onBlur={handleOnBLur.bind(
                          this,
                          "event_registration_email"
                        )}
                        helperText={
                          blurFields.event_registration_email &&
                          !fields.event_registration_email
                            ? "Must not be Empty."
                            : fields.event_registration_email &&
                              !fields.event_registration_email.match(
                                emailRegexp
                              )
                            ? "Must be a Valid Email"
                            : ""
                        }
                        variant="outlined"
                        defaultValue={fields.event_registration_email}
                        onChange={handleChange.bind(
                          this,
                          "event_registration_email"
                        )}
                      />
                    </Grid>
                  </Grid>
                </form>
              </CardContent>
            </Card>
            </Grid>
           
          </React.Fragment>
        )}
        {step === 1 && (
          <Grid xs={12}>
            <Accordion style={{ margin: "10px 0px" }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Grid container justify="space-between">
                  <div>
                    <Word fontSize='16px' >Registration Details for</Word>
                    <Word fontSize='24px' color='grey'>
                      {fields.event_registration_firstname +
                        " " +
                        fields.event_registration_lastname}
                    </Word>
                  </div>
                  <div>
                    <Word fontSize='16px' >AMOUNT</Word>
                    <Word fontSize='24px' color='orange'>
                      {calculateTotalPrice(fields)}
                    </Word>
                  </div>
                </Grid>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container direction="column">
                  <Word color='grey' fontSize='24'>Registration Information</Word>
                  <Divider />

                  <Grid container justify="space-between" style={{margin:'10px 0px'}}>
                    <Word fontSize='16'>
                      {fields.event_registration_firstname +
                        " " +
                        fields.event_registration_lastname}
                    </Word>
                    <Word fontSize='16'>
                      {RegSetup.event_currency === "USD" ? "$" : ""}
                      {fields.event_registration_type_price}
                    </Word>
                  </Grid>
                  {fields.workshops.length > 0 && (
                    <div>
                      <Word color='grey' fontSize='24'> Additional Services</Word>
                      <Divider />
                      {fields.workshops.map((workshop, index) => {
                        let obj = RegSetup.workshops.find(
                          (o) =>
                            o.event_workshop_id === workshop.event_workshop_id
                        );
                        console.log(obj);
                        return (
                          <Grid container justify="space-between" style={{margin:'10px 0px'}}>
                            <Word fontSize='16px'>{obj.event_workshop_title}</Word>
                            <Word fontSize='16px'>
                              {RegSetup.event_currency === "USD" ? "$" : ""}
                              {obj.event_workshop_price}
                            </Word>
                          </Grid>
                        );
                      })}
                    </div>
                  )}
                </Grid>
              </AccordionDetails>
            </Accordion>
            <Word>Workshops</Word>
            {RegSetup.workshops.map((workshop, index) => {
              return (
                <Card>
                  <CardContent>
                    <Grid container justify="space-between" alignItems="center">
                      <Word fontSize='16px'>{workshop.event_workshop_title}</Word>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Word fontSize='16px'>
                          {RegSetup.event_currency === "USD" ? "$" : ""}
                          {countOfWorkshop()}
                          {workshop.event_workshop_price}
                        </Word>
                        <IconButton
                          onClick={() =>
                            handleAddWorkshop(
                              workshop.event_workshop_id,
                              workshop.event_workshop_price
                            )
                          }
                        >
                          <AddCircleOutlineOutlinedIcon />
                        </IconButton>
                      </div>
                    </Grid>
                  </CardContent>
                </Card>
              );
            })}
          </Grid>
        )}
        {step === 2 && (
          <Grid xs={12}>
            <Word>Registration Summary</Word>
            {result.map((value, participantIndex) => {
              console.log(value);
              return (
                <Accordion style={{ margin: "10px 0px" }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Grid container justify="space-between" style={{margin: '10px 0px'}}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <IconButton
                          onClick={() => deleteParticipant(participantIndex)}
                        >
                          <CancelOutlined />
                        </IconButton>
                        <div>
                          <Word>Registration Details for</Word>
                          <InformationWord>
                            {value.event_registration_firstname +
                              " " +
                              value.event_registration_lastname}
                          </InformationWord>
                        </div>
                      </div>

                      <div>
                        <Word>Amount</Word>
                        <Word color='orange'>
                          {calculateTotalPrice(value)}
                        </Word>
                      </div>
                    </Grid>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container direction="column" style={{margin: '10px 0px'}}>
                      <InformationWord>
                        Registration Information
                      </InformationWord>
                      <Divider />

                      <Grid
                        container
                        justify="space-between"
                        alignItems="center"
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <IconButton
                            onClick={() => editParticipant(participantIndex)}
                          >
                            <EditOutlined />
                          </IconButton>
                          <Word>
                            {value.event_registration_firstname +
                              " " +
                              value.event_registration_lastname}
                          </Word>
                        </div>

                        <Word>
                          {RegSetup.event_currency === "USD" ? "$" : ""}
                          {value.event_registration_type_price}
                        </Word>
                      </Grid>
                      <div>
                        <InformationWord> Additional Services</InformationWord>
                        <Divider />
                        {value.workshops.map((workshop, workshopIndex) => {
                          let obj = RegSetup.workshops.find(
                            (o) =>
                              o.event_workshop_id === workshop.event_workshop_id
                          );
                          return (
                            <Grid
                              container
                              justify="space-between"
                              alignItems="center"
                              style={{margin: '10px 0px'}}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <IconButton
                                  onClick={() =>
                                    deleteAdditionalService(
                                      participantIndex,
                                      workshopIndex
                                    )
                                  }
                                >
                                  <CancelOutlined />
                                </IconButton>
                                <Word>
                                  {obj.event_workshop_title}
                                </Word>
                              </div>

                              <Word>
                                {RegSetup.event_currency === "USD" ? "$" : ""}
                                {obj.event_workshop_price}
                              </Word>
                            </Grid>
                          );
                        })}
                      </div>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              );
            })}
            <Divider />
            <NewParticipantGrid
              container
              justify="space-between"
              alignItems="center"
              alignContent="center"
            >
              <NextStep
                variant="contained"
                color="primary"
                onClick={() => {
                  setOpenNewParticipantDialog(true);
                }}
              >
                {" "}
                New Participant
              </NextStep>
              <div>
                <Word>Total</Word>
                <Word color={'orange'}>{calculateTotal()}</Word>
              </div>
            </NewParticipantGrid>
            <Divider />
          </Grid>
        )}
      </LayoutGrid>
      <LayoutGrid item container  justify="space-around">
        <NewParticipantGrid container
              justify="space-around"
              alignItems="center"
              alignContent="center">
        {step !== 0 && step !== 2 && (
          <NextStep
            variant="contained"
            color="primary"
            onClick={() => {
              setStep(step - 1);
            }}
          >
            Back
          </NextStep>
        )}
        {step <= 1 && (
          <NextStep
            variant="contained"
            color="primary"
            disabled={nextDisabled()}
            onClick={() => {
              setStep(step + 1);
              if (step + 1 === 2) {
                let tempResult = [...result];

                if (edit) {
                  tempResult[editIndex] = fields;
                  setEdit(false);
                  setEditIndex(null);
                } else {
                  tempResult.push(fields);
                }
                setResult(tempResult);
              }
            }}
          >
            Next
          </NextStep>
        )}
        </NewParticipantGrid>
        
        {step === 2 && (
          <React.Fragment>
            <NextStep
              variant="contained"
              color="primary"
              onClick={() => {
                console.log({registrations:result});
              }}
            >
              Submit
            </NextStep>
          </React.Fragment>
        )}
      </LayoutGrid>
    </Grid>
  );
};

export default Home;
