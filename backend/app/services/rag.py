from langchain_chroma import Chroma
from langchain.prompts import ChatPromptTemplate
import aiohttp

from ..core.config import settings
from ..utils.embedding import get_embedding_function

PROMPT_TEMPLATE = """
Answer the question based only on the following context:

{context}

---

Answer the question based on the above context: {question}
"""

def generate_system_prompt(config: dict) -> str:
    """Generate a system prompt based on the configuration."""
    
    content_type_prompts = {
        "blog": "Create a blog post",
        "social": "Create a social media post",
        "email": "Write an email",
        "article": "Write an article"
    }
    
    tone_prompts = {
        "professional": "Use a professional and business-appropriate tone",
        "casual": "Use a casual and relaxed tone",
        "friendly": "Use a friendly and approachable tone",
        "formal": "Use a formal and academic tone"
    }
    
    # Start with the base prompt
    prompt = f"You are a content generation assistant. {content_type_prompts.get(config.get('contentType', 'blog'), 'Create content')}. "
    
    # Add tone instruction
    prompt += tone_prompts.get(config.get('tone', 'professional'), '') + ". "
    
    # Add creativity instruction based on level (0-100)
    creativity_level = config.get('creativityLevel', 70)
    if creativity_level < 30:
        prompt += "Be very conservative and factual in your writing. "
    elif creativity_level > 70:
        prompt += "Be creative and innovative in your writing. "
    else:
        prompt += "Balance creativity with factual content. "
    
    # Add SEO instruction if enabled
    if config.get('seoOptimization', False):
        prompt += "Optimize the content for SEO, including relevant keywords and proper structure. "
    
    return prompt

async def query_rag(query_text: str, config: dict = None) -> str:
    """
    Process the query using RAG with configuration settings.
    """
    if config is None:
        config = {}
    
    try:
        # Prepare the DB.
        embedding_function = get_embedding_function()
        db = Chroma(persist_directory=settings.CHROMA_PATH, embedding_function=embedding_function)

        # Search the DB.
        results = db.similarity_search_with_score(query_text, k=5)

        context_text = "\n\n---\n\n".join([doc.page_content for doc, _score in results])
        prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
        prompt = prompt_template.format(context=context_text, question=query_text)

        async with aiohttp.ClientSession() as session:
            try:
                async with session.post(
                    f"{settings.VM_ENDPOINT}/generate",
                    headers={"Content-Type": "application/json"},
                    json={
                        "prompt": prompt,
                        "model": "llama3.2-vision",
                        "max_tokens": 200
                    },
                    timeout=30  # Add timeout
                ) as response:
                    if response.status != 200:
                        error_text = await response.text()
                        raise Exception(f"TEE endpoint returned status {response.status}: {error_text}")
                    
                    response_data = await response.json()
                    response_text = response_data.get("response", "")
            except aiohttp.ClientError as e:
                raise Exception(f"Network error while calling TEE endpoint: {str(e)}")

        sources = [doc.metadata.get("id", None) for doc, _score in results]
        formatted_response = f"Response: {response_text}\nSources: {sources}"
        print(formatted_response)
        return response_text
        
    except Exception as e:
        print(f"Error in query_rag: {str(e)}")
        raise  # Re-raise the exception instead of returning an error message
