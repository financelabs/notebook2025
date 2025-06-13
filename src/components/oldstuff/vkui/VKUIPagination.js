import React, { useState, useCallback} from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useFetchQuizesArrayQuery } from '../services/fincalculations';


import { Div,
    Pagination,
    Placeholder
 } from '@vkontakte/vkui';

 import { Icon56ServicesOutline } from "@vkontakte/icons"
import { setActivePage } from '../features/application/applicationSlice';



 const VKUIPaginationLayout = () => { 
    const { error, isLoading } = useFetchQuizesArrayQuery();

    if (isLoading || error) {
        return <Placeholder icon={<Icon56ServicesOutline />}>
        </Placeholder>
      } 

    return <VKUIPagination />

 }

const VKUIPagination = () => { 
    const dispatch = useDispatch();
    const { data } = useFetchQuizesArrayQuery();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(data.length);

    const handleChange = useCallback((page) => {
        console.log(page);
        setCurrentPage(page);
        dispatch(setActivePage(page-1));
      }, []);

      

    return <Div>
    <Pagination
      navigationButtonsStyle={'icon'}
      currentPage={currentPage}
      siblingCount={1}
      boundaryCount={1}
      totalPages={totalPages}
      disabled={false}
      onChange={handleChange}
    />
  </Div>
 
}

export default VKUIPaginationLayout