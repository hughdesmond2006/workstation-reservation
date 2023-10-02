import axios from "axios";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setReservations, setSelectedWorkstation } from "../redux/store";
import { PropTypes } from "prop-types";

/*
  A simple selectable icon that represents a workstation. 
  Clicking it will refresh the list of reservations for this workstation and display them in the grid.
  The database supports positioning of the workstations within a display grid using xPos and yPos but
  this was left out for the purpose of this prototype
 */
function Workstation({ _id, name }) {
  const dispatch = useDispatch();

  const selectedWorkstation = useSelector(
    (state) => state.selectedWorkstation.value
  );

  const borderColor =
    selectedWorkstation._id === _id ? "#ffd79e" : "transparent";

  const getReservations = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/reservations/${_id}`
      );

      dispatch(setReservations(res.data));
      dispatch(setSelectedWorkstation({ _id, name }));
    } catch (error) {
      console.log("Error getting reservations for #" + _id, error);
    }
  };

  // just for initial load, get reservations for the first workstation
  useEffect(() => {
    if (_id === selectedWorkstation?._id) {
      getReservations();
    }
  }, []);

  return (
    <s.Wrapper $borderColor={borderColor} onClick={getReservations}>
      <s.Title>{name}</s.Title>
      <s.Icon
        xmlns="http://www.w3.org/2000/svg"
        height="85"
        viewBox="0 -960 960 960"
        width="85"
      >
        <path d="M80-120q-17 0-28.5-11.5T40-160q0-17 11.5-28.5T80-200h800q17 0 28.5 11.5T920-160q0 17-11.5 28.5T880-120H80Zm80-120q-33 0-56.5-23.5T80-320v-440q0-33 23.5-56.5T160-840h640q33 0 56.5 23.5T880-760v440q0 33-23.5 56.5T800-240H160Zm0-80h640v-440H160v440Zm0 0v-440 440Z" />
      </s.Icon>
    </s.Wrapper>
  );
}

const s = {
  Wrapper: styled.div`
    position: relative;
    cursor: pointer;
    margin: 0.5rem;
    padding: 0;
    border: 4px solid ${(props) => props.$borderColor};
    border-radius: 0.3rem;

    &:hover {
      border: 4px solid #ffb144;
    }
  `,
  Title: styled.div`
    position: absolute;
    top: 27px;
    width: 100%;
  `,
  Icon: styled.svg`
    padding: 0;
    margin: 0;
  `,
};

Workstation.propTypes = {
  _id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default Workstation;
