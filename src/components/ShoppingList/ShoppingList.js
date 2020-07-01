import React, {useState} from "react";
import classes from './ShoppingList.module.css';
import Close from '../../assets/close.svg';

const ShoppingList = props => {

    const [inputValue,changeInputValue] = useState(props.count);

    const inputChange = (e) => {
        changeInputValue(e.target.value);
    }

    return (
        <li className={classes.Shopping__item} data-itemid={props.id}>
            <div className={classes.Shopping__count}>
                <input onChange={inputChange} type="number" value={inputValue} step={props.count}/>
                <p>{props.unit}</p>
            </div>
            <p className={classes.Shopping__description}>{props.ingredient}</p>
            <button onClick={props.deleteShoppingList} className={classes.Shopping__delete}>
                <img src={Close} alt="close"/>
            </button>
        </li>
    )
}

export default ShoppingList;