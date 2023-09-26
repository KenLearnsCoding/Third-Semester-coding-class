function step1() {
  return new Promise((resolve, reject) => {
    resolve("step 1 result");
  });
}

function step2() {
  return "step 2 result";
}

function step3() {
  return fetch("https://pokeapi.co/api/v2/pokemon/mewtwo").then((response) => {
    return response.json();
  }).then((json) => {
    return `step 3 result ${json["name"]}`;
  });
}

async function step4() {
  return new Promise((resolve, reject) => {
    resolve("step 4");
  }).then((result) => {
    return result + " result";
  });
}

async function steps() {
  let result1 = step1();
  let result2 = step2();
  let result3 = step3();
  let result4 = step4();
  
  console.log(result1);
  console.log(result2);
  console.log(result3);
  console.log(result4);
}

steps();


// function step1() {
//   return new Promise((resolve, reject) => {
//     resolve("step 1 result");
//   });
// }

// function step2() {
//   return "step 2 result";
// }

// function step3() {
//   return fetch("https://pokeapi.co/api/v2/pokemon/mewtwo").then((response) => {
//     return response.json();
//   }).then((json) => {
//     return `step 3 result ${json["name"]}`;
//   });
// }

// async function step4() {
//   return new Promise((resolve, reject) => {
//     resolve("step 4");
//   }).then((result) => {
//     return result + " result";
//   });
// }

// async function steps() {
//   let result1 = step1();
//   let result2 = step2();
//   let result3 = step3();
//   let result4 = step4();
  
//   console.log(result1);
//   console.log(result2);
//   console.log(result3);
//   console.log(result4);
// }

// steps();