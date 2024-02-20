const food = require("../constants/food.json");
const PinecodeService = require("../ai/init/pinecone");
const OpenAIClient = require("../ai/api/openAiClient");
const sleep = require("./sleep");
const { OpenAIEmbeddings } = require("@langchain/openai");
const fs = require('fs')

let foodData = [];
let start = 1,
  end = 3;
console.log(food.length);

for (; start < end; start++) {
  foodData.push(food[start]);
}

console.log(foodData.length);

const storeFoodEmbeddingsToPinecone = async () => {
  /* Create instance */
  const embeddings = new OpenAIEmbeddings(
    {
        openAIApiKey: ""
    }
  );
  const pinecodeService = new PinecodeService();
  const openAIClient = new OpenAIClient();


  const records = await Promise.all(foodData.map(async (foodItem) => {
      const {
        RecipeName,
        TranslatedIngredients,
        Cuisine,
        Course,
        Diet,
        TranslatedInstructions,
        Srno,
      } = foodItem;

      const foodContext = `RecipeName: ${RecipeName}.\nIngredients: ${TranslatedIngredients}.`;

      const foodEmbedding = await embeddings.embedQuery(foodContext);

      const record = {
        id: Srno.toString(),
        values: foodEmbedding,
        metadata: {
          ...foodItem,
        },
      };

    //   await pinecodeService.Upsert([record]);

      return record;
    }));

    fs.writeFile ("embeddings.json", JSON.stringify(records), function(err) {
        if (err) throw err;
        console.log('complete');
        }
    );
    


//   await pinecodeService.Upsert(records);
};

