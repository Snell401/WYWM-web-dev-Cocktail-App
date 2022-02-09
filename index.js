//*************connect html elements to js
const title = document.getElementById('title');
const search = document.getElementById('findByIngredient');
const ingredient = document.getElementById('cocktailIngredient');
const getRandom = document.getElementById('randomButton');
const drinkSection = document.getElementById('drink-section');

// name the URLs here to make it cleaner in the functions
const randomURL = 'https://www.thecocktaildb.com/api/json/v1/1/random.php';
const ingredientURL = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=';
const idURL = 'https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=';

// UTILITY FUNCTIONS // UTILITY FUNCTIONS // UTILITY FUNCTIONS //


function checkStatus(response) {
    if (response.status !== 200) {
      throw new Error(`Status error: ${response.status}`)
  
    } else {
      return response.json()
    }
  }
  
  
  function clearBar() {
    // Remove current children of drink section
    while (drinkSection.firstChild) {
      drinkSection.removeChild(drinkSection.lastChild);
    }
  }
  
  
  function addCocktail(data) {
    // data will have the structure { drinks: Object[] }
    // Only one cocktail will be present, so we simply choose the
    // first object in the drinks array
    displayCocktail(data.drinks[0]);
  }



  // RANDOM COCKTAIL // RANDOM COCKTAIL // RANDOM // RANDOM COCKTAIL //


//*************get the API and iterate through the objects to display the results if fail then catch it and display the error********
function getRandomCocktail() {
    fetch(randomURL)
    .then(checkStatus)
    .then(replaceCurrentCocktail)
        .catch(function (err) {
            console.log('There was an error:', err);
        });
    // ****** clear the bar before adding the new cocktail *********
    function replaceCurrentCocktail(data) {
        clearBar ()
        addCocktail(data)
    }
}

// FIND BY INGREDIENT // FIND BY INGREDIENT // FIND BY INGREDIENT //

function findByIngredient() {
    const chosenIngredient = ingredient.value
    if (!chosenIngredient) {
      return
    } else if (chosenIngredient.indexOf(",") > -1) {
      // You need to be a $2+ Patreon supporter to search for multi-ingredients so i can only show you the first one
      return
    }
    
    // ********* replace the current cocktail with the new one *********
   const searchURL = `${ingredientURL}${chosenIngredient}`;
    fetch(searchURL)
    .then(checkStatus)
    .then(replaceCurrentCocktails)
        .catch(function (err) {
            console.log('There was an error:', err);
        });
 /**
   *
   * @param {Object} data has the format:
   * { "drinks": [
   *     {
   *       "strDrink": "Brandy Flip",
   *       "strDrinkThumb": "https://www.thecocktaildb.com/images/...jpg",
   *       "idDrink": "11164"
   *     },
   *     ...
   *   ]
   * }
   */

  function replaceCurrentCocktails(data) {
    // console.log("data", JSON.stringify(data, null, '  '));
    clearBar()
    data.drinks.forEach(getCocktailById);
  }
  function getCocktailById(cocktailData) {
    const id = cocktailData.idDrink
    const searchURL = `${idURL}${id}`

    fetch(searchURL)
    .then(checkStatus)
    .then(addCocktail)
    .catch(error => console.log("Error in getCocktailById", error));
  }
}


// DISPLAY COCKTAIL // DISPLAY COCKTAIL / DISPLAY / DISPLAY COCKTAIL //

// ***** display the information about the cocktail
function displayCocktail(cocktail) {
    //console.log("cocktail", JSONstringify(cocktail, null,' '));
    // Add h2 title with name of the cocktail
    const drinkName = document.createElement('h2');
    drinkName.innerHTML = cocktail.strDrink;
    drinkSection.appendChild(drinkName);
    //add image of the cocktail
    const img = document.createElement('img');
    img.src = cocktail.strDrinkThumb;
    drinkSection.appendChild(img);
    // add <ul> with ingredients
    const ul = document.createElement('ul');
    drinkSection.appendChild(ul)

// ******* there are  UPTO 15 ingredients in the cocktail therefor loop through 15 times only *********
    for (let i = 1; i < 16; i++) {
        //if there are no more ingredients, break out of the loop
        const ingredient = cocktail[`strIngredient${i}`];
        if (!ingredient) {
            break;
        }
        // Some ingredients like "egg" don't have any quanity, so we need
        // to account for that
        let quantity = cocktail[`strMeasure${i}`] || "";
        if (quantity) {
            quantity = ": " + quantity
        }
        // create a <li> for each ingredient and the quantity and append it to the <ul>
        const ingredientLI = document.createElement("li");
        ingredientLI.innerText = ingredient + quantity;
        ul.appendChild(ingredientLI);
    }
//  ******* add the instructions to the page *********
    let instructions = document.createElement("p");
    instructions.innerHTML = cocktail.strInstructions;
    drinkSection.appendChild(instructions);
}

// KEYBOARD SHORTCUT // KEYBOARD SHORTCUT // KEYBOARD SHORTCUT //

function checkForEnter(event) {
    if (event.key === "Enter") {
      event.preventDefault()
      findByIngredient()
    }
  }
  
  // Activate the buttons
  search.addEventListener("click", findByIngredient)
  ingredient.addEventListener("keyup", checkForEnter)

  // Open the page with a random cocktail by default
getRandomCocktail();
getRandom.addEventListener("click", getRandomCocktail)