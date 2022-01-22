import React from "react";
import "../parentPage.css";
import Header from "../../header/Header";
import { Link, useParams } from 'react-router-dom';

function ParentStudentDetails(){
    const param= useParams();
    const exampleStudent = {
        name:"Al",
        id: param.id,
        school: param.school,
        route: "#1",
    }

    return(
        <>  
        <Header textToDisplay={"Parent Portal"}></Header>
        <div className='middle-justify'>
            <div className='admin-details'>
                    <h1>Your Student's Details</h1>
                    <div className='info-fields'>
                        <h2>Name:</h2>
                        <h3>{exampleStudent.name}</h3>
                    </div>
                    <div className='info-fields'>
                        <h2>ID:</h2>
                        <h3>{exampleStudent.id}</h3>
                    </div>
                    <div className='info-fields'>
                        <h2>School:</h2>
                        <h3>{exampleStudent.school}</h3>
                    </div>
                    <div className='info-fields'>
                        <h2>Route:</h2>
                        <h3>{exampleStudent.route}</h3>
                    </div>

                    <div className='edit-delete-buttons'>
                        <Link to="/parent">
                            <button>Go Back</button>
                        </Link>
                    </div>
            </div>
        </div>
    </>
    );
}
export default ParentStudentDetails;