import { useState, useEffect } from "react";
import Workstation from "./components/Workstation";
import SocialSignIn from "./components/SocialSignIn";
import axios from "axios";
import BookingCalendar from "./components/BookingCalendar";
import styled from "styled-components";

/*
  Main page composed of subcomponents: signin, workstation display & select, booking calendar.
  Nothing much to note at this level, drill into each component for more detail.
*/
function App() {
  const [workstations, setWorkstations] = useState([]);

  useEffect(() => {
    getWorkstations();
  }, []);

  const getWorkstations = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/workstations`
      );

      setWorkstations(res.data);
    } catch (error) {
      console.log("err", error);
    }
  };

  return (
    <s.Page>
      <h2>Workstation Reservation</h2>
      <SocialSignIn />
      {/* <SignUp /> */}
      <s.WorkstationsContainer>
        {workstations.map((w) => {
          return (
            <Workstation
              key={w._id}
              _id={w._id}
              name={w.name}
              xPos={w.xPos}
              yPos={w.yPos}
            />
          );
        })}
      </s.WorkstationsContainer>
      <s.Space />
      <BookingCalendar />
    </s.Page>
  );
}

const s = {
  Page: styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    text-align: center;
  `,
  WorkstationsContainer: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 80%;
    max-width: 700px;
    flex-wrap: wrap;
  `,
  Space: styled.div`
    height: 16rem;
    position: relative;
  `,
};

export default App;
