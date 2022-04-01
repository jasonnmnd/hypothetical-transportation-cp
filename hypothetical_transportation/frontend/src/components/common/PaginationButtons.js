import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useSearchParams } from 'react-router-dom';
import "./generalTable.css"
import { Button, Pagination } from 'react-bootstrap';
import { pageSize } from '../../actions/utils';

function PaginationButtons( props ) {

    let [searchParams, setSearchParams] = useSearchParams();

    const pageNumWithPrefix = `${props.prefix}pageNum`;

    const setTablePage = (newPage) => {
        setSearchParams({
            ...Object.fromEntries([...searchParams]),
            [pageNumWithPrefix]: newPage
        })
    }

    const getSearchParamPageNum = () => {
        if(searchParams.get(pageNumWithPrefix) == null){
            return 1
        }
        return searchParams.get(pageNumWithPrefix)
    }

    const isTablePage = (page) => {
        return getSearchParamPageNum() == page;
    }

    const getCurrentPage = () => {
        return parseInt(getSearchParamPageNum());
    }


    const handlePrevClick = () => {
        setTablePage(parseInt(getSearchParamPageNum()) - 1)
    }
    
    const handleNextClick = () => {
        setTablePage(parseInt(getSearchParamPageNum()) + 1)
    }

    const handleAllClick = () => {
        setTablePage(-1)
    }

    const handleLessClick = () => {
        setTablePage(1)
    }

    const getLastPage = () => {
        return Math.ceil(props.count / pageSize);
    }

    const getDistFromLastPage = () => {
        return getLastPage() - getCurrentPage();
    }

    const getStartNums = () => {
        return (
            <>
                {getCurrentPage() > 1 ? <Pagination.Item onClick={() => setTablePage(1)}>{1}</Pagination.Item> : null}
                {getCurrentPage() > 4 ? <Pagination.Ellipsis disabled /> : null}
                {getCurrentPage() > 3 ? <Pagination.Item onClick={() => setTablePage(getCurrentPage() - 2)}>{getCurrentPage() - 2}</Pagination.Item> : null}
                {getCurrentPage() > 2 ? <Pagination.Item onClick={() => setTablePage(getCurrentPage() - 1)}>{getCurrentPage() - 1}</Pagination.Item> : null}
            </>
        )
    }

    const getEndNums = () => {
        return (
            <>
                {getDistFromLastPage() > 1 ? <Pagination.Item onClick={() => setTablePage(getCurrentPage() + 1)}>{getCurrentPage() + 1}</Pagination.Item> : null}
                {getDistFromLastPage() > 2 ? <Pagination.Item onClick={() => setTablePage(getCurrentPage() + 2)}>{getCurrentPage() + 2}</Pagination.Item> : null}
                {getDistFromLastPage() > 3 ? <Pagination.Ellipsis disabled /> : null}
                {getDistFromLastPage() > 0 ? <Pagination.Item onClick={() => setTablePage(getLastPage())}>{getLastPage()}</Pagination.Item> : null}
            </>
        )
    }

    const getPagination = () => {
        return (
            <div>
                <Pagination>
                    <Pagination.First onClick={() => setTablePage(1)}/>
                    <Pagination.Prev onClick={handlePrevClick} disabled={isTablePage(1)} />
                    {getStartNums()}
                    <Pagination.Item active >{getCurrentPage()}</Pagination.Item>
                    {getEndNums()}
                    <Pagination.Next onClick={handleNextClick} disabled={isTablePage(getLastPage())}/>
                    <Pagination.Last onClick={() => setTablePage(getLastPage())}/>
                </Pagination>
                <div className='d-flex flex-row justify-content-center' style={{marginTop: "10px"}}>
                    <Button variant='prevnext' onClick={handleAllClick} >Show All</Button>
                </div>
            </div>
        )
    }

    
  
    return (
        <div className='d-flex flex-row justify-content-center'>
            <div>
                {getSearchParamPageNum() == -1 ? <Button className='btn-prevnext' onClick={handleLessClick}>Show Less</Button> : getPagination()}
            </div>
        </div>
    )

}

PaginationButtons.propTypes = {
    //prevDisable: PropTypes.bool,
    //nextDisable: PropTypes.bool,
    count: PropTypes.number,
    prefix: PropTypes.string
}

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps)(PaginationButtons)