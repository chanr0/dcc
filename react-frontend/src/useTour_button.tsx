import {useReducer, useEffect} from "react";
import Joyride, {CallBackProps, STATUS, ACTIONS, EVENTS} from "react-joyride";
import Button from "@mui/material/Button";
import { Box } from "@mui/material";


const joyrideStyles = {
  options: {
    zIndex: 10000,
    primaryColor: '#7c6daa',
    textColor: 'rgb(0,0,0)',
  },
};

const useTour = (TOUR_STEPS: any) => {

  const INITIAL_STATE = {
    key: new Date(), // This field makes the tour to re-render when we restart the tour
    run: false,
    continuous: true,
    loading: false,
    stepIndex: 0,
    steps: TOUR_STEPS
  };
  
  // Reducer will manage updating the local state
  const reducer = (state = INITIAL_STATE, action: any) => {
    switch (action.type) {
      case "START":
        return { ...state, run: true };
      case "RESET":
        return { ...state, stepIndex: 0 };
      case "STOP":
        return { ...state, run: false };
      case "NEXT_OR_PREV":
        console.log(action.payload)
        console.log({...state, ...action.payload})
        return { ...state, ...action.payload };
      case "RESTART":
        return {
          ...state,
          stepIndex: 0,
          run: true,
          loading: false,
          key: new Date()
        };
      default:
        return state;
    }
  };
  // Tour state is the state which control the JoyRide component
  const [tourState, dispatch] = useReducer(reducer, INITIAL_STATE);

  useEffect(() => {
    // Auto start the tour if the tour is not viewed before
    dispatch({ type: "START" });
  }, []);

  const callback = (data: CallBackProps) => {
    const { action, index, type, status } = data;

    if (
      // If close button clicked then close the tour
      action === ACTIONS.CLOSE ||
      // If skipped or end tour, then close the tour
      (status === STATUS.SKIPPED && tourState.run) ||
      status === STATUS.FINISHED
    ) {
      dispatch({ type: "STOP" });
    } else if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      // Check whether next or back button click and update the step
      if (action === 'prev' && index + (action === ACTIONS.PREV ? -1 : 1) === 0){
        dispatch(
          {type: "RESTART"}
        )
      } // restarts if reversed into the first, due to a bug
      else{
        dispatch({
          type: "NEXT_OR_PREV",
          payload: { stepIndex: index + (action === ACTIONS.PREV ? -1 : 1) }
        });
      }
    }
  }; 

  const startTour = () => {
    // Start the tour manually
    dispatch({ type: "RESTART" });
  };

  return (
    <>
      <Box textAlign='center' marginBottom={5}>
        <Button variant="contained" onClick={startTour}> Restart Tour </Button>
      </Box>
      <Joyride
        {...tourState}
        // Callback will pass all the actions
        callback={callback}
        continuous={true}
        showSkipButton={true}
        scrollToFirstStep={true}
        styles={joyrideStyles}
        showProgress={true}
        steps={TOUR_STEPS}
      />
    </>
  );
};

export default useTour;
