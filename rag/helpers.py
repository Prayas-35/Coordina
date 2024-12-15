from langchain_community.document_loaders import TextLoader
from langchain_community.vectorstores import TiDBVectorStore
from langchain_text_splitters import CharacterTextSplitter
from langchain_google_genai.embeddings import GoogleGenerativeAIEmbeddings
from langchain.prompts import PromptTemplate
from langchain.chains import RetrievalQA
from langchain.llms.base import LLM
from pydantic import BaseModel
from typing import Any, List, Optional
from groq import Groq
import dotenv
import os
import json

dotenv.load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

MODEL = "llama-3.1-70b-versatile"
TEMP = 0.3


class CustomConfig(BaseModel):
    api_url: str
    api_key: str


class CustomAPILLM(LLM):
    api_key: str = None
    api_url: str = None

    def __init__(self, config: CustomConfig, callbacks: Optional[List] = None):
        super().__init__()
        self.api_url = config.api_url
        self.api_key = config.api_key
        self.callbacks = callbacks or []

    @property
    def _llm_type(self) -> str:
        return "custom_api"

    def _call(
        self,
        prompt: str,
        stop: Optional[List[str]] = None,
        run_manager: Optional[Any] = None,
        **kwargs: Any,
    ) -> str:
        client = Groq(api_key=GROQ_API_KEY)
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model=MODEL,
            temperature=TEMP,
        )
        return chat_completion.choices[0].message.content


loader = TextLoader(file_path="data2.txt", encoding="utf-8")
docs = loader.load()

text_splitter = CharacterTextSplitter(chunk_size=3000, chunk_overlap=500)
documents = text_splitter.split_documents(docs)

embeddings = GoogleGenerativeAIEmbeddings(
    model="models/embedding-001",
    google_api_key=GOOGLE_API_KEY,
)

capath = "/etc/ssl/certs/ca-certificates.crt" if os.path.exists("/etc/ssl/certs/ca-certificates.crt") else "isrgrootx1.pem"
vector_store = TiDBVectorStore.from_documents(
    documents=documents,
    embedding=embeddings,
    table_name="ConflictResolution",
    connection_string=f"mysql+mysqldb://2DXyH3NQNPFiCYW.root:UHsVdjbJrSqD2xpo@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/test?ssl_ca={capath}",
    distance_strategy="cosine",
    drop_existing_table=True,
)

retriever = vector_store.as_retriever(score_threshold=0.9)  # Increased threshold for better filtering

config = CustomConfig(api_url="", api_key=GROQ_API_KEY)
custom_llm = CustomAPILLM(config=config)

async def generate(quest, conversation_history):
    try:
        # print(conversation_history)
        rephrasing_prompt = f"""
            Your name is Murex, an expert in natural language processing and intergovernmental conflict resolution. Your task is to rephrase the user's input into a concise and relevant query optimized for semantic search in a vector database. Follow these strict guidelines:

            1. Focus exclusively on topics related to conflicts, their resolutions, and resource coordination between government departments.
            2. If the input is a greeting, transition, or unrelated to intergovernmental conflicts, resource optimization, or project management, output "NONE".
            3. Ensure the output is a single, precise query optimized for vector database semantic search.
            4. Provide only the resulting query or "NONE" as output, without any additional text, explanation, or formatting.

            **Examples**:
            - USER INPUT: "How can two departments coordinate roadwork and pipeline projects?"
            OUTPUT: "Coordination strategies for roadwork and pipeline projects between departments?"
            - USER INPUT: "What methods are used to resolve scheduling conflicts in government projects?"
            OUTPUT: "Methods to resolve scheduling conflicts in government projects?"
            - USER INPUT: "Hey, can you help me plan a vacation?"
            OUTPUT: "NONE"
            - USER INPUT: "What are best practices for prioritizing multi-department initiatives?"
            OUTPUT: "Best practices for prioritizing multi-department initiatives?"
            - USER INPUT: "Tell me about the weather today."
            OUTPUT: "NONE"

            USER INPUT: {quest}
            CONTEXT: {conversation_history}
        """

        client = Groq(api_key=GROQ_API_KEY)
        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": rephrasing_prompt}],
            model=MODEL,
            temperature=TEMP
        )
        refined_question = chat_completion.choices[0].message.content

        if refined_question == "NONE":
            prompt_template = f"""
                You are Murex, an expert mentor specializing in intergovernmental project management, AI-driven conflict resolution, and historical data analysis.

                Guidelines:  
                1. If the question falls outside these domains, respond: "The question is outside the scope of the provided context, so I cannot answer it."  
                2. If the question is a greeting, respond with a friendly greeting.  

                ### Question:  
                {quest}

                ### Context:
                {conversation_history}
            """


            response = client.chat.completions.create(
                messages=[{"role": "user", "content": prompt_template}],
                model=MODEL,
                temperature=TEMP
            )
            return response.choices[0].message.content

        prompt_template = f"""
        You are Murex, an expert mentor specializing in intergovernmental project management, AI-driven conflict resolution, and historical data analysis. 
            Provide accurate, detailed, and helpful responses based strictly on the given context and conversation history. 

            ### Guidelines:
            1. **Strict Relevance**: Only answer questions directly related to the provided context or conversation history. If a question is irrelevant to the context, clearly state: 
            - "The question is outside the scope of the provided context, so I cannot answer it."
            2. **Conflict Resolution Focus**: Leverage insights from historical data and multi-departmental project management principles to address issues such as overlapping projects and resource optimization.
            3. **Concise Responses**: Provide to-the-point answers, limiting your response to a maximum of 3 sentences or 150 words, unless additional detail is absolutely necessary.
            4. **Insufficient Information**: If the context or history does not provide enough details, state explicitly: 
            - "I don't have enough information to provide a meaningful answer."
            5. **Structured Solutions**: Provide actionable steps or frameworks for resolving conflicts, such as dependency mapping, project prioritization, and coordination guidelines.
            6. **Clarity and Simplicity**: Break down complex concepts into simple, clear explanations for better understanding.
            7. **Best Practices**: Highlight recommended approaches for interdepartmental collaboration, such as phased planning and shared resource management, and warn against common pitfalls.
            8. **Closing Statement**: If the conversation appears to have concluded, provide a positive and concise closing statement.
            9. **No Speculation**: Avoid speculative or generic answers. Stick strictly to the context provided.

            ### Input Structure:
            - **Previous Conversation**: 
            {conversation_history}
            - **Context**: 
            {{context}}
            - **Question**: 
            {{question}}
        """

        PROMPT = PromptTemplate(
            template=prompt_template,
            input_variables=["context", "question"]
        )

        chain_type_kwargs = {"prompt": PROMPT}

        chain = RetrievalQA.from_chain_type(
            llm=custom_llm,
            chain_type="stuff",
            retriever=retriever,
            input_key="query",
            return_source_documents=True,
            chain_type_kwargs=chain_type_kwargs
        )

        response = chain({"query": refined_question, "question": quest})
        serializable_response = {
            "result": response.get("result", "I don't know."),
            "source_documents": [doc.page_content for doc in response.get("source_documents", [])]
        }
        # print(json.dumps(serializable_response, indent=4))
        return serializable_response["result"]

    except Exception as e:
        print(e)
        return "I am sorry, I am down for the moment. Please try again later."