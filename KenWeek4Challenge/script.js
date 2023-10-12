
const fs = require('fs').promises; // Use fs.promises for async file reading
const path = require('path');//put the path here to allow this program access to the fil path. 

const sourceFiles = ["./chestnut_j.json", "./hasselhoff_d.json", "./kardashian_k.json", 
            "./palin_s.json", "./sagdiyev_b.json", "./putin_v.json"]//I create the array here with the path file inside. 

const targetFile = './output/output.json';//the file path for a single output file. 
let combineJsonFiles = async () => {
    let CombinedDataFile = [];//I have to create this empty array to add the multiple json files' data 
    for (const sourceFile of sourceFiles) { //i dont want to use loop with counting, cause it makes the code more mathematical and i am over stress to work with math now. 
        const sourceData = await fs.readFile(sourceFile, 'utf8');//read the file 
        const sourceObject = JSON.parse(sourceData);//convert the json file to js format 
        // Merge the data from the source object into the combined object
        CombinedDataFile.push(sourceObject);//I use push to to push all data form json files, because if i use object.assign(). 
                                            //The output file only contains last json file's data. Its weird so i have to find another way. 
        const jsonString = JSON.stringify(CombinedDataFile, null, 2);//convert the data back to json format again. 
        await fs.writeFile(targetFile, jsonString, 'utf8');//paste data to the output json file.
        // console.log(await fs.readFile(targetFile, 'utf8'))
    }
}


let ChangeData = async () => {
    const dataOutput = await fs.readFile(targetFile, 'utf8');//read file
    const jsonObjectOutput = JSON.parse(dataOutput);//Change to js Object
    //This code below is for replacing the value with the key "votedFor".
    //I found this code from a document online to work with multiple objects. 
    //Its ez if I work with a single object in a single JSON file. 
    await jsonObjectOutput.forEach((item) => {
        if (item.hasOwnProperty('votedFor')) {
          item.votedFor = 'KanYeW';
        }
    });
    console.log(jsonObjectOutput);//as your recommendation, I use the console to check the result of each small task
      
    updatedJsonString = JSON.stringify(jsonObjectOutput, null, 2);//convert to string
    await fs.writeFile(targetFile, updatedJsonString, 'utf8');//paste data to the output json file. 
}

//This function will add a new pair key and value to the output json file
let AddKey = async () => {
    const dataOutput = await fs.readFile(targetFile, 'utf8');//read file 
    const jsonObjectOutput = JSON.parse(dataOutput); // Change to JavaScript Object
    //Here again, i use forEach function to access to each object in the json file. 
    jsonObjectOutput.forEach((item) => {
        //I really stuck here when i didnt who belong to democrat or republic and other. I have to ask the boys about them =))
      if (item.hasOwnProperty('votedFor')) {
        if (item.votedFor === 'Joey B') {
          item.party = 'democrat';
        } else if (item.votedFor === 'Donny T') {
          item.party = 'republican';
        } else {
          item.party = 'other';
        }
      }
    });

    const jsonString = JSON.stringify(jsonObjectOutput, null, 2);//convert to string
    await fs.writeFile(targetFile, jsonString, 'utf8');

}


combineJsonFiles().then(() => {
    //the output will give a different result if I don't call this Addkey function before the ChangeData function. 
    return AddKey();
}).then(() => {
    // Once combined, change the "votedFor" value
    return ChangeData();
});



