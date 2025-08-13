import { filterChange } from '../reducers/filterReducer'
import { useDispatch } from 'react-redux'

const Filter = () => {
    const dispatch = useDispatch()
    const handleFilterChange = (event) => {
      dispatch(filterChange(event.target.value))
    }

    const style = {
        marginBottom: 10
    }

    return(
        <div style={style}>
             <div>filter <input name="filter"  onChange={handleFilterChange} /></div>
        </div>
    )
}

export default Filter