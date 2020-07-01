import React from "react";
import classes from './LikesResults.module.css';

const LikesResults = props => {
    return(
        <li onClick={props.click}>
            <a className={classes.Likes__link} href={"#"+props.recipe_id}>
                <figure className={classes.Likes__fig}>
                    <img src={props.img_url} alt={props.title}/>
                </figure>
                <div>
                    <h4 className={classes.Likes__name}>{props.title}</h4>
                    <p className={classes.Likes__author}>{props.publisher}</p>
                </div>
            </a>
        </li>
    )
};

export default LikesResults;