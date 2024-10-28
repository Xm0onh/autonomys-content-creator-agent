
## Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn
- Ollama (for local LLM support)

## Setup

### Backend Setup

1. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file in the `backend` directory with your API keys:
```env
GOOGLE_API_KEY=your_google_api_key
GOOGLE_CSE_ID=your_google_cse_id
DSN_API_KEY=your_dsn_api_key
```

4. Install and run Ollama:
```bash
# Follow instructions at https://ollama.ai/download
# Then pull the required model:
ollama pull llama3
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

## Running the Application

### Start the Backend

1. Navigate to the backend directory:
```bash
cd backend
```

2. Run the FastAPI server:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend API will be available at `http://localhost:8000`

### Start the Frontend

1. In a new terminal, navigate to the frontend directory:
```bash
cd frontend
```

2. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The frontend application will be available at `http://localhost:5173`


## API Endpoints

- `POST /upload` - Upload documents
- `GET /query` - Query the AI system
- `POST /search` - Perform Google search
- `POST /chat/context` - Add context to chat (Vector Database)
- `GET /retrieve/{cid}` - Retrieve file by CID

