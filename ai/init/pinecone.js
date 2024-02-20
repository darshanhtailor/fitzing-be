const { Pinecone } = require("@pinecone-database/pinecone")

const PINECONE_ENV = ""
const PINECONE_API_KEY = "";
const PINECONE_INDEX_NAME = "fitzing"



class PinecodeService {

    constructor() {
        this.pineconeClient = new Pinecone({
            apiKey: PINECONE_API_KEY
          });

        this.pineconeIndex = this.pineconeClient.index(PINECONE_INDEX_NAME)
    }

    async Upsert(records) {
        console.log(records)
        try {
            await this.pineconeIndex.upsert(records);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = PinecodeService;