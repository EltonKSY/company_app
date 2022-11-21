import React from 'react';

import ReactDOM from 'react-dom';

import classes from './Modal.module.css';

//The dark overlay that covers the screen
//onClick should normally be a function that unmounts Modal
const BackDrop = props => <div className={classes.backdrop} id="modal" onClick={props.onConfirm} />;

const Overlay = props => <div className={classes.overlay}>{props.component}</div>;

function Modal(props) {
  return (
    <>
      {/* {ReactDOM.createPortal(<BackDrop onConfirm={props.onConfirm} />, document.getElementById('root-modal'))}
      {ReactDOM.createPortal(<Overlay component={props.component} />, document.getElementById('root-overlay'))} */}
      <BackDrop onConfirm={props.onConfirm} />
      <Overlay component={props.component} onConfirm={props.onConfirm} />
    </>
  );
}

export default Modal;
