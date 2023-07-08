
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";
const joyrideStyles = {
  options: {
    zIndex: 10000,
    primaryColor: '#7c6daa',
    textColor: 'rgb(0,0,0)',
  },
};
export default function useTour(
  steps: Step[],
  localStorageKey: string | null
): ReactNode {
  const [run, setRun] = useState(false);
  useEffect(
    function () {
      if (!localStorageKey) {
        setRun(true);
        return;
      }
      const tourViewed = window.localStorage.getItem(localStorageKey);
      if (tourViewed) {
        return;
      }
      window.localStorage.setItem(localStorageKey, "1");
      setRun(true);
    },
    [localStorageKey]
  );
  const handleJoyrideCallback = useCallback(function (data: CallBackProps) {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];
    if (finishedStatuses.includes(status)) {
      // alert("Tour finalizado!");
    }
  }, []);
  const tour = useMemo<ReactNode>(
    () => (
      <Joyride
        callback={handleJoyrideCallback}
        continuous={true}
        run={run}
        scrollToFirstStep={true}
        showProgress={true}
        showSkipButton={true}
        steps={steps}
        styles={joyrideStyles}
      />
    ),
    [steps, handleJoyrideCallback, run]
  );
  return tour;
}