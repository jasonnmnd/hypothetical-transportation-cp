import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useSearchParams } from 'react-router-dom';
import "./generalTable.css"
import { Button } from 'react-bootstrap';

function PaginationButtons( props ) {

    let [searchParams, setSearchParams] = useSearchParams();

    const pageNumWithPrefix = `${props.prefix}pageNum`;


    const handlePrevClick = () => {
        setSearchParams({
            ...Object.fromEntries([...searchParams]),
            [pageNumWithPrefix]: parseInt(searchParams.get(pageNumWithPrefix)) - 1
        })
      }
    
      const handleNextClick = () => {
        setSearchParams({
            ...Object.fromEntries([...searchParams]),
            [pageNumWithPrefix]: parseInt(searchParams.get(pageNumWithPrefix)) + 1
        })
      }

      const handleAllClick = () => {
        setSearchParams({
            ...Object.fromEntries([...searchParams]),
            [pageNumWithPrefix]: -1
        })
      }

      const handleLessClick = () => {
        setSearchParams({
            ...Object.fromEntries([...searchParams]),
            [pageNumWithPrefix]: 1
        })
      }
  
    return (
        // <div className='align-all-buttons'>
        //     <div className="prev-next-buttons">
        //         {searchParams.get(pageNumWithPrefix) == -1 ? 
        //         <button className='button' onClick={handleLessClick}>Show Less</button> 
        //         :
        //         <div> 
        //         <button className={(searchParams.get(pageNumWithPrefix) == 1) ? 'button-disabled' : 'button'} onClick={handlePrevClick} disabled={searchParams.get(pageNumWithPrefix) == 1} >Prev</button>
        //         {searchParams.get(pageNumWithPrefix)}
        //         <button className={props.nextDisable ? 'button-disabled' : 'button'} onClick={handleNextClick} disabled={props.nextDisable} >Next</button> 
        //         <div className='divider15px'/>
        //         <br></br>
        //         <button className='button' onClick={handleAllClick} >Show All</button>
        //         </div>}
        //     </div>
        // </div>

        <>
            <div className='d-flex flex-row justify-content-center'>
                {searchParams.get(pageNumWithPrefix) == -1 ? 
                 <Button className='btn-prevnext' onClick={handleLessClick}>Show Less</Button> 
                 :
                 <div> 
                    <Button variant={(searchParams.get(pageNumWithPrefix) == 1) ? 'prevnext_disabled' : 'prevnext'} onClick={handlePrevClick} disabled={searchParams.get(pageNumWithPrefix) == 1} >Prev</Button>
                    {" "}
                    {searchParams.get(pageNumWithPrefix)}
                    {" "}
                    <Button variant={props.nextDisable ? 'prevnext_disabled' : 'prevnext'} onClick={handleNextClick} disabled={props.nextDisable}>Next</Button> 

                    <div className='d-flex flex-row justify-content-center' style={{marginTop: "10px"}}>
                        <Button variant='prevnext' onClick={handleAllClick} >Show All</Button>
                    </div>
                 </div>
                 
                }

            </div>
        </>
    )

}

PaginationButtons.propTypes = {
    //prevDisable: PropTypes.bool,
    nextDisable: PropTypes.bool,
    prefix: PropTypes.string
}

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps)(PaginationButtons)