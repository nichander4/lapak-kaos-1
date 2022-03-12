import { Step, StepLabel, Stepper } from "@mui/material";
import styled from "../styles/layout.module.css";
import React from "react";

const CheckoutWizard = ({ activeStep = 0 }) => {
  return (
    <Stepper className={styled.transparentBackground} activeStep={activeStep} alternativeLabel>
      {["Login", "Shipping Address", "Payment Method", "Place Order"].map(
        (step) => (
          <Step key={step}>
            <StepLabel>{step}</StepLabel>
          </Step>
        )
      )}
    </Stepper>
  );
};

export default CheckoutWizard;
