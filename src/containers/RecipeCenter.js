import React, {useState} from "react";
import classes from './RecipeCenter.module.css';
import Logo from '../assets/logo.png';
import MagnifyingGlass from '../assets/search.svg';
import RedHeart from '../assets/heart.svg';
import axios from 'axios';
import SearchResults from "../components/SearchResults/SearchResults";
import Button from "../components/SearchResults/Button/Button";
import Spinner from "../components/UI/Spinner";
import Recipe from "../components/Recipe/Recipe";
import LikesResults from "../components/LikesResults/LikesResults";
import ShoppingList from "../components/ShoppingList/ShoppingList";
import uniqid from "uniqid";

const RecipeCenter = () => {

    //SearchResults states
    const [recipeFind, setRecipeFind] = useState("");
    const [recipes, setRecipes] = useState([]);
    const [loader, setLoader] = useState(false);
    const [goToPage, setGoToPage] = useState(1);

    //SearchResults methods
    const recipeSearch = (event) => {
        setRecipeFind(event.target.value);
    }

    const getResults = async (e) => {
        e.preventDefault();
        setLoader(false);
        let loader = [<Spinner/>];
        setRecipes(loader);
        let result = await axios(`https://forkify-api.herokuapp.com/api/search?&q=${recipeFind}`);
        setLoader(true);
        setRecipes(result.data.recipes);
        setRecipeFind('');
    }

    const onButtonClick = (event) => {
        let btn = event.target.closest('button');
        const goToPage = parseInt(btn.dataset.goto);
        setGoToPage(goToPage);
    }

    const renderButtons = (page, numResults, resPage) => {
        const pages = Math.ceil(numResults / resPage);
        let button;
        if (page === 1 && pages > 1) {
            button = <Button click={onButtonClick} page={page} type='next'/>
        } else if (page < pages) {
            button = <React.Fragment>
                <Button click={onButtonClick} page={page} type='prev'/>
                <Button click={onButtonClick} page={page} type='next'/>
            </React.Fragment>
        } else if (page === pages && pages > 1) {
            button = <Button click={onButtonClick} page={page} type='prev'/>
        }
        return button;
    }

    const showRecipes = (recipes, page = 1, resPerPage = 10) => {
        let start = (page - 1) * resPerPage;
        let end = page * resPerPage;
        let rec = recipes.slice(start, end).map((element, index) => {
            return (<SearchResults
                key={index}
                img_url={element.image_url}
                recipe_id={element.recipe_id}
                title={element.title}
                publisher={element.publisher}
                click={()=>fetchData(element.recipe_id)}
            />);
        });
        return rec;
    }

    const showButtons = (recipes, page = 1, resPerPage = 10) => {
        let btns = renderButtons(page, recipes.length, resPerPage);
        return btns;
    }

    // Recipe States

    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [img, setImg] = useState('');
    const [url, setUrl] = useState('');
    const [ingredients, setIngredients] = useState([]);
    const [servings] = useState(4);
    const [likes, setLikes] = useState([]);
    const [likesIDS,setLikesIDS] = useState([]);


    const [clickedRecipe, setClickedRecipe] = useState(false);

    //Recipe Methods

    const parseIngredients = (ingredients) => {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g'];

        const newIngredients = ingredients.map(el => {
            //1) Uniform units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, index) => {
                ingredient = ingredient.replace(unit, unitsShort[index])
            })
            //2) Remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ')
            //3)Parse ingredients into count, unit and ingredient
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex((el) => units.includes(el));

            let objIngredient = {};
            if (unitIndex > -1) {
                //There is a unit
                const arrCount = arrIng.slice(0, 0); // ex: 4 1/2 cups, arrCount = [4, 1/2] || 4 cups, arrCount =[4]
                let count;
                if (arrCount.length === 1) {
                    // eslint-disable-next-line
                    count = eval(arrIng[0].replace('-', '+'));
                } else {
                    // eslint-disable-next-line
                    count = eval(arrIng.slice(0, unitIndex).join('+'))
                }

                objIngredient = {
                    count: count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                }

            } else if (parseInt(arrIng[0], 10)) {
                //There is no unit, but 1st element is a number
                objIngredient = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            } else if (unitIndex === -1) {
                //There is no unit and no number in 1st position
                objIngredient = {
                    count: 1,
                    unit: '',
                    ingredient: ingredient
                }
            }

            return objIngredient;
        });
        return newIngredients;
    }
    const fetchData = async (id) => {
        const result = await axios(`https://forkify-api.herokuapp.com/api/get?&rId=${id}`);
        setTitle(result.data.recipe.title);
        setAuthor(result.data.recipe.publisher);
        setImg(result.data.recipe.image_url)
        setUrl(result.data.recipe.source_url);
        setIngredients(parseIngredients(result.data.recipe.ingredients));
        setClickedRecipe(true);
    }

    const isLiked = id => {
        return likesIDS.findIndex(el=>el===id) !== -1;
    }

    const clickLove = () => {
        let currRecID = window.location.hash.replace('#','');
        if(likesIDS.includes(currRecID)){
            setLikes(likes.filter(item => item.id !== currRecID));
            setLikesIDS(likesIDS.filter(item=>item!==currRecID));
        }else{
            recipes.map((element,index)=>{
                if(element.recipe_id === currRecID){
                    let likedEl = {
                        id:element.recipe_id,
                        content: <LikesResults
                            key={element.recipe_id}
                            img_url={element.image_url}
                            recipe_id={element.recipe_id}
                            title={element.title}
                            publisher={element.publisher}
                            click={()=>fetchData(element.recipe_id)}
                        />
                    }

                    setLikes(prevState => [...prevState,likedEl])
                    setLikesIDS(prevState => [...prevState, element.recipe_id]);
                    return likedEl;
                }else{
                    return <div> </div>
                }
            });
        }
    }

    // Shopping list state

    const [elementsShopping,setElementsShopping] = useState([]);


    const addElementToShoppingList = (count,unit,ingredient) =>{
        let element = {
            id: uniqid(),
            count,
            unit,
            ingredient,
            prodID: window.location.hash.replace('#','')
        }
        let ids = elementsShopping.map(e=>{
            return e.prodID;
        });
        if (!ids.includes(element.prodID)){
            setElementsShopping(prevState => [...prevState,element]);
        }
    }

    const addElementToUI = (localCounter) => {
        ingredients.forEach((e,i)=>{
            addElementToShoppingList(localCounter[i],e.unit,e.ingredient);
        })
    }


    const deleteElementShoppingList = id => {
        let elementsLocal = [...elementsShopping];
        let index = elementsLocal.findIndex(el=> el.id === id);
        elementsLocal.splice(index,1);
        setElementsShopping(elementsLocal);

    }

    return (
        <div className={classes.Container}>
            <div className={classes.Container__Header}>
                <header className={classes.Header}>
                    <img src={Logo} alt="Logo" className={classes.Header__logo}/>
                    <form onSubmit={getResults} className={classes.Search}>
                        <input onChange={recipeSearch} type="text" className={classes.Search__field}
                               value={recipeFind}
                               placeholder="Search over 1,000,000 recipes..."/>
                        <button className={classes.Btn}>
                            <img src={MagnifyingGlass} alt='Search'/>
                            <span>Search</span>
                        </button>
                    </form>
                    <div aria-disabled={true} className={classes.Likes}>
                        <div className={classes.Likes__field}>
                            <img src={RedHeart} className={classes.Likes__icon} alt='Search'/>
                        </div>
                        <div className={classes.Likes__panel}>
                            <ul className={classes.Likes__list}>
                                {likes.length?likes.map(el=>el.content): <div className={classes.PlaceHolder}>Oops! You got nothing in your favorites yet</div>}
                            </ul>
                        </div>
                    </div>
                </header>
            </div>
            <div className={classes.Container__Main}>
                <div className={classes.Results}>
                    <ul className={classes.Results__List}>
                        {loader ? showRecipes(recipes, goToPage) : recipes[0]}
                    </ul>

                    <div className={classes.Results__pages}>
                        {loader ? showButtons(recipes, goToPage) : null}
                    </div>
                </div>


                <div className={classes.Recipe}>
                    {clickedRecipe ? <Recipe
                        title={title}
                        img={img}
                        author={author}
                        url={url}
                        ingredients={ingredients}
                        time={Math.ceil(ingredients.length/3)*15}
                        servings={servings}
                        click={clickLove}
                        likesIDS={likesIDS}
                        liked={isLiked}
                        recipes={recipes}
                        addShoppingList={addElementToUI}
                    /> : null}
                </div>


                <div className={classes.Shopping}>
                    <h2 className={classes.Heading_2}>My Shopping List</h2>

                    <ul className={classes.Shopping__list}>
                        {elementsShopping.map(e=>{
                            return (
                                <ShoppingList
                                    key={e.id}
                                    count={e.count}
                                    id={e.id}
                                    unit={e.unit}
                                    ingredient={e.ingredient}
                                    deleteShoppingList={()=>deleteElementShoppingList(e.id)}
                                />
                            )
                        })}
                    </ul>
                </div>
            </div>
            </div>

    )
}

export default RecipeCenter;