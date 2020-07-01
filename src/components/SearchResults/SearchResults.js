import React from "react";
import classes from './SearchResults.module.css';

const SearchResults = props => {
    return(
        <li onClick={props.click}>
            <a className={classes.Results__link} href={"#"+props.recipe_id}>
                <figure className={classes.Results__fig}>
                    <img src={props.img_url} alt={props.title}/>
                </figure>
                <div className={classes.Results__data}>
                    <h4 className={classes.Results__name}>{props.title}</h4>
                    <p className={classes.Results__author}>{props.publisher}</p>
                </div>
            </a>
        </li>
    )
};

export default SearchResults;