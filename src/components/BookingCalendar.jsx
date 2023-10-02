import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import Grid from "./Grid";
import moment from "moment";
import Modal from "./Modal";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { socket } from "../socket";
import { setReservations } from "../redux/store";

// set times based on business rules
const times = [
  "9:00",
  "9:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
];

const slotSizeInMinutes = 30;
const headerFormat = "ddd D";
const basicDateFormat = "YYYY-MM-DD";

socket.on("reservationAdded", (reservationData) => {
  console.log("A new reservation just was made", reservationData);

  // here we can add fancy stuff like real-time alerts when the currently selected
  // workstation just got booked, or when a day is booked out for a workstation
});

// this component consists of a flexible table with times/dates for viewing and making
// reservation. Clicking on a cell in the table will bring up a modal to confirm booking.
function BookingCalendar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null); // moment object
  const [gridData, setGridData] = useState(null); // array of arrays (see Grid.js)
  const [dates, setDates] = useState([]);

  const dispatch = useDispatch();

  const reservations = useSelector((state) => state.reservations.value);
  const selectedWorkstation = useSelector(
    (state) => state.selectedWorkstation.value
  );

  // translate the mongodb data into the required display grid data format
  const getGridData = useCallback(async () => {
    const today = moment();
    let headerArray = [];
    let dates = [];

    const isWeekDay = (day) => !(day.includes("Sun") || day.includes("Sat"));

    for (let i = 0; i < 7; i++) {
      const day = moment().add(i, "days");

      // dont include sat/sun (non-working days)
      if (isWeekDay(day.format(headerFormat))) {
        headerArray.push(day.format(headerFormat));
        dates.push(day.format(basicDateFormat));
      }
    }

    if (isWeekDay(today.format(headerFormat))) {
      headerArray[0] = "Today";
    }

    // add empty space for side header
    headerArray.unshift("");

    let data = [];

    // loop through each cell and check if its booked or not
    for (let t = 0; t < times.length; t++) {
      const row = [times[t]];

      for (let d = 0; d < dates.length; d++) {
        let cellString = "";

        for (let r = 0; r < reservations.length; r++) {
          if (
            reservations[r].reservationStart.includes(dates[d]) &&
            reservations[r].reservationStart.includes(times[t])
          ) {
            cellString = "Booked";
          }
        }

        row.push(cellString);
      }

      data.push(row);
    }

    // add header array to the data, at the first position
    data.unshift(headerArray);

    setGridData(data);
    setDates(dates);
  }, [reservations]);

  const onCloseModal = () => {
    setIsModalOpen(false);
  };

  const onCellClick = async (e, rowIndex, colIndex) => {
    const basicDateTimeFormat = "YYYY-MM-DD hh:mm";

    const slot = moment(
      `${dates[colIndex - 1]} ${times[rowIndex]}`,
      basicDateTimeFormat
    );

    if (colIndex != 0) {
      setSelectedSlot(slot);
      setIsModalOpen(true);
    }
  };

  const handleReservation = async () => {
    const dbDateFormat = "YYYY-MM-DDTHH:mm:00.000[Z]";

    try {
      const dateFormatted = moment(selectedSlot).format(dbDateFormat);

      const reservationStart = dateFormatted;

      // add the standard slot size EG. 30 mins to the start date to set the end date
      const reservationEnd = moment(selectedSlot)
        .add(slotSizeInMinutes, "minutes")
        .format(dbDateFormat);

      const reservationData = {
        userId: 3,
        reservationStart,
        reservationEnd,
        workstationId: selectedWorkstation._id,
      };

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/reservations`,
        reservationData
      );

      // Emit a WebSocket event to notify other clients about the new reservation
      socket.emit("reservationAdded", reservationData);

      // refresh reservations
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/reservations/${
            selectedWorkstation._id
          }`
        );

        dispatch(setReservations(res.data));
      } catch (error) {
        console.log("Error refreshing reservations", error);
      }

      onCloseModal();
    } catch (error) {
      console.log("Error submitting the reservation", error);
    }
  };

  /* 
    react 18 way to handle calling a function from useffect...
    getGridData is a callback that will refresh every time the currently displayed reservations change
    ie. a new workstation is selected or a new reservation is added 
  */
  useEffect(() => {
    getGridData();
  }, [getGridData]);

  // basic dialog to confirm booking
  const content = (
    <>
      <s.ModalContent>
        <p>{`Book "${selectedWorkstation?.name}" for 30 minutes on:`}</p>
        <h5>
          {selectedSlot ? selectedSlot.format("MMMM Do YYYY, h:mm:ss a") : ""}
        </h5>
      </s.ModalContent>
      <s.ModalButtons>
        <button onClick={onCloseModal}>Cancel</button>
        <button onClick={handleReservation}>Reserve</button>
      </s.ModalButtons>
    </>
  );

  return (
    <>
      <s.Grid data={gridData} onCellClick={onCellClick} />
      <Modal content={content} isOpen={isModalOpen} onClose={onCloseModal} />
    </>
  );
}

/* 
  Influenced from React Native: Having the raw css available (via styled-components) at the bottom of each 
  component is very handy for the developer experience, its nice to quickly copy paste bits of css from chrome 
  or other resources directly where you need it and you can alt/ctrl click an element in most IDES to jump to its styles.
  This keeps the actual returned DOM structure very uncluttered. 
*/
const s = {
  Grid: styled(Grid)`
    position: absolute;
    bottom: 0;
  `,
  ModalContent: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;

    p,
    h5 {
      margin: 0.5rem;
      padding: 0;
    }
  `,
  ModalButtons: styled.div`
    display: flex;
    justify-content: space-between;
  `,
};

export default BookingCalendar;
