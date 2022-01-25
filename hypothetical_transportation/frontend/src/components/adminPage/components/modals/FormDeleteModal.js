import React, {useState} from 'react';
import "./modal.css";

function FormDeleteModal({closeModal, handleConfirmDelete}) {

    const [schoolName, setSchoolName] = useState("");

    return (
        <div className='modalBackground'>
            <div className='modalContainer'>
                <div className='titleCloseBtn'>
                        <button onClick={
                            () => closeModal(false)
                        }> X </button>
                </div>
                <div className='title>'>
                    <h1>Are you sure you want to delete this record?</h1>
                </div>
                <div className='body'>
                    <p>This action cannot be undone.</p>
                </div>
                <div className="modal-form">
                    <form>
                        <label>Enter the school name to confirm:  
                            <input type="text" value={schoolName} onChange={(e) => setSchoolName(e.target.value)}/>
                        </label>
                    </form>
                </div>
                <div className='footer'>
                    <button onClick={
                        () => closeModal(false)
                    } id="cancelBtn">Cancel</button>
                    <button onClick={
                        () => {
                            handleConfirmDelete(schoolName);
                            closeModal(false);
                        }
                    } id="confirmBtn">Continue</button>
                </div>
            </div>
        </div>
      );
}

export default FormDeleteModal;
