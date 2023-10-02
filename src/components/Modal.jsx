import styled from "styled-components";
import { useEffect } from "react";
import { PropTypes } from "prop-types";

// basic react modal
function Modal({ content, isOpen, onClose }) {
  // Add event listeners when the modal is open
  useEffect(() => {
    const handleClickOutside = (e) => {
      console.log("huh", e.target, e.target.className);
      if (e.target.className === "modal") {
        onClose();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape" || e.key === "Backspace") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("click", handleClickOutside);
    } else {
      // Remove event listeners when the modal is closed
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("click", handleClickOutside);
    }

    // Clean up event listeners when the component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <s.wrapper>
      {isOpen && (
        <div className="modal">
          <div className="click-catcher">
            <div className="modal-content">
              <span className="close" onClick={onClose}>
                &times;
              </span>
              {content}
            </div>
          </div>
        </div>
      )}
    </s.wrapper>
  );
}

const s = {
  wrapper: styled.div`
    /* CSS for the modal container */
    .modal {
      display: block;
      position: fixed;
      z-index: 1;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
    }

    // wider area around dialog to catch misclicks which would annoying close the modal by accident
    .click-catcher {
      border: 2rem solid transparent;     // set a color test
      margin: 15% auto;
      margin-top: 6rem;
      position: relative;
      width: fit-content;
    }

    /* CSS for the modal content */
    .modal-content {
      background-color: white;
      padding: 1rem;
      border: 1px solid #888;
      width: 20rem;
      position: relative;
    }

    /* CSS for the close button */
    .close {
      color: #aaa;
      float: right;
      font-size: 2rem;
      font-weight: bold;
    }

    .close:hover,
    .close:focus {
      color: black;
      text-decoration: none;
      cursor: pointer;
    }
  `,
};

Modal.propTypes = {
  content: PropTypes.node.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Modal;
