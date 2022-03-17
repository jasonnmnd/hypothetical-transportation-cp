import React, { useState } from 'react'
import AdminHeader from '../../header/AdminHeader'

function GeneralUploadFilePage() {
  const [file, setFile] = useState();

  const fileReader = new FileReader();


  const handleChange = (e) => {
    setFile(e.target.files[0]);
    console.log(e.target.files[0])
  }
  const handleOnSubmit = (e) => {
    e.preventDefault();

    if (file) {
        fileReader.onload = function (event) {
            const csvOutput = event.target.result;
            console.log(csvOutput)
        };

        fileReader.readAsText(file);
    }
};

  return (
    <div>
    <AdminHeader></AdminHeader>

    <form>
      <input
          type={"file"}
          id={"csvFileInput"}
          accept={".csv"}
          onChange={handleChange}
      />

      <button
          onClick={(e) => {
              handleOnSubmit(e);
          }}
      >
          IMPORT CSV
      </button>
  </form>
  </div>
  )
}

export default GeneralUploadFilePage