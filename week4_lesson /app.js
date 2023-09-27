async function callapi() { 
    let result = await fetch("http://localhost:3000").then((response) => {
        return response.json();
    });


    console.log(`My name is ${result["name"]}. I am ${result["age"]} years old.`);
}

callapi();