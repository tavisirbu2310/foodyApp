import React, {useState,useEffect} from "react";
import classes from './Recipe.module.css';
import {Fraction} from 'fractional';
import StopWatch from '../../assets/stopwatch.svg';
import Man from '../../assets/man.svg';
import Minus from '../../assets/minus.svg';
import Plus from '../../assets/plus.svg';
import OutlinedHeart from '../../assets/outlinedHeart.svg';
import FullHeart from '../../assets/fullHeart.svg';
import Check from '../../assets/check.svg';
import ShoppingCart from '../../assets/shopping-cart.svg';
import TriangleDirection from '../../assets/triangle-right.svg';

const Recipe = props => {

    const [localCounter, setLocalCounter] = useState(props.ingredients.map(element => element.count));
    const [servings, setServings] = useState(props.recipes.map(e => props.servings));

    useEffect(()=>{
        setServings(props.recipes.map(e => props.servings));
        setLocalCounter(props.ingredients.map(element => element.count));
    },[props.ingredients,props.recipes,props.servings])

    const formatCount = count => {
        if (count) {
            // ex: 2.5 --> 2 1/2
            // ex: 0.5 --> 1/2
            const newCount = Math.round(count * 10000) / 10000;
            const [int, dec] = newCount.toString().split('.').map(el => parseInt(el, 10));
            if (!dec) return newCount;
            if (int === 0) {
                const fr = new Fraction(newCount);
                return `${fr.numerator}/${fr.denominator}`
            } else {
                const fr = new Fraction(newCount - int);
                return `${int} ${fr.numerator}/${fr.denominator}`
            }
        }
        return '-';
    };

    const updateRecipe = (type) => {
        props.recipes.forEach((e, i) => {
            if (e.recipe_id === window.location.hash.replace('#', '')) {
                let items = [...servings];
                let item = items[i];
                let count = localCounter;
                if (type === 'dec' && item > 1) {
                    item = item - 1;
                    let newCount = count.map(e=>e*(item/items[i]));
                    items[i] = item;
                    setServings(items);
                    setLocalCounter(newCount);
                } else if (type === 'inc') {
                    item = item + 1 ;
                    let newCount = count.map(e=>e*(item/items[i]));
                    items[i] = item;
                    setServings(items);
                    setLocalCounter(newCount);
                }
            }
        })
    }

        return (
            <React.Fragment>

                <figure className={classes.Recipe__fig}>
                    <img src={props.img} alt={props.title} className={classes.Recipe__img}/>
                    <h1 className={classes.Recipe__title}>
                        <span>{props.title}</span>
                    </h1>
                </figure>

                <div className={classes.Recipe__details}>
                    <div className={classes.Recipe__info}>
                        <img className={classes.Recipe__infoIcon} src={StopWatch} alt="stopwatch"/>
                        <span className={classes.Recipe__infoData}>{props.time}</span>
                        <span> minutes</span>
                    </div>
                    <div className={classes.Recipe__info}>
                        <img className={classes.Recipe__infoIcon} src={Man} alt="man"/>
                        <span className={classes.Recipe__infoData}>{props.recipes.map((e, i) => {
                            if (e.recipe_id === window.location.hash.replace('#', '')) {
                                return servings[i];
                            }
                            return null;
                        })}</span>
                        <span> servings</span>

                        <div className={classes.Recipe__infoButtons}>
                            <button onClick={() => updateRecipe('dec')} className={classes.BtnTiny}>
                                <img src={Minus} alt="minus"/>
                            </button>
                            <button onClick={() => updateRecipe('inc')} className={classes.BtnTiny}>
                                <img src={Plus} alt="plus"/>
                            </button>
                        </div>

                    </div>
                    <button onClick={props.click} className={classes.Recipe__love}>
                        <img src={props.liked(window.location.hash.replace('#', '')) ? FullHeart : OutlinedHeart}
                             alt="heartoutlined"/>
                    </button>
                </div>

                <div className={classes.Recipe__ingredients}>
                    <ul className={classes.Recipe__ingredientList}>

                        {props.ingredients.map((element, index) => {
                                return (
                                    <li key={index} className={classes.Recipe__item}>
                                        <img className={classes.Recipe__icon} src={Check} alt="check"/>
                                        <div className={classes.Recipe__count}>{formatCount(localCounter[index])}</div>
                                        <div>
                                            <span>{element.unit} </span>
                                            {element.ingredient}
                                        </div>
                                    </li>
                                )
                            }
                        )}
                    </ul>

                    <button onClick={()=>props.addShoppingList(localCounter)} className={classes.BtnSmall}>
                        <img src={ShoppingCart} alt="cart"/>
                        <span>Add to shopping list</span>
                    </button>
                </div>
                <div className={classes.Recipe__directions}>
                    <h2 className={classes.Heading2}>How to cook it</h2>
                    <p className={classes.Recipe__directionsText}>
                        This recipe was carefully designed and tested by
                        <span className={classes.Recipe__by}> {props.author}</span>. Please check out directions at
                        their website.
                    </p>
                    <a className={classes.BtnSmall} href={props.url} target="_blank" rel='noopener noreferrer'>
                        <span>Directions</span>
                        <img src={TriangleDirection} alt="triangle"/>
                    </a>
                </div>
            </React.Fragment>
        );
    }

    export default Recipe;