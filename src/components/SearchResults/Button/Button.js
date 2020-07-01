import React from "react";
import LeftArrow from '../../../assets/left-arrow.svg';
import RightArrow from '../../../assets/right-arrow.svg';
import classes from './Button.module.css';

const Button = props => {
    return (
        <button onClick={props.click} className={classes.BtnInline} data-goto={props.type==='prev'?props.page-1:props.page+1}>
            <span>Page {props.type === 'prev' ? props.page - 1 : props.page + 1}</span>
            <img src={props.type === 'prev' ? LeftArrow : RightArrow} alt='arrows'/>
        </button>
    )
}

export default Button;